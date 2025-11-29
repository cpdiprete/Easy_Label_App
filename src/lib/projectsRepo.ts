// lib/projectsRepo.ts
// import { db, newId } from "./db";
import { db, newId } from "./mvp_db";

export type Prompt = { id: string; question: string; options: { id: string; text: string }[]; orderIndex: number };
export type Project = {
    id: string;
    title: string;
    admin: string;
    organization: string;
    protocolpdf?: string;
    description?: string;
    images: string[]; // URIs (file://…)
    prompts: Prompt[];
    // createdAt: number;
    updatedAt: number;
};
// CREATE
export function createProject(p: {
    title: string;
    admin: string;
    organization: string;
    protocolpdf?: string;
    description?: string;
    prompts?: { question: string; options: string[] }[];
    imageUris?: string[];
}): string {
    console.log("beggining of create project database funnction")
    const id = newId();
    const now = Date.now();
    console.log("date added")
    db.execSync("BEGIN");
    console.log("db.execSync called")
    db.runSync(
        `INSERT INTO PROJECTS_USER (title,admin_contact,organization,protocol_pdf,description,last_updated,labeled_count)
        VALUES (?,?,?,?,?,?,?)`, [p.title, p.admin, p.organization, p.protocolpdf ?? null, p.description ?? null, now, 0]
    );
    const row = db.getFirstSync<{ id: number }>(
        "SELECT last_insert_rowid() AS id"
    );
    if (!row) {
        throw new Error("Could not retrieve last inserted project ID");
    }
    (p.prompts ?? []).forEach((pr, i) => {

        const projectId = row.id;
        db.runSync(
            `INSERT INTO PROMPTS (project_id)
            VALUES (?)`, [projectId]
        );
        const last_row = db.getFirstSync<{ id: number }>(
            "SELECT last_insert_rowid() AS id"
        );
        if (!last_row) {
            throw new Error("Could not retrieve last inserted project ID");
        }
        const prompt_id = last_row.id;
        pr.options.forEach((opt, j) => {
            db.runSync(
                `INSERT INTO PROMPT_OPTION (prompt_id, option_text, order_index)
                VALUES (?,?,?)`, [prompt_id, opt, j]
            );
        });
    });

    
    // (p.imageUris ?? []).forEach((uri) => {
    //     db.runSync(
    //         `INSERT INTO project_images (id, projectId, uri, updatedAt)
    //         VALUES (?,?,?,?)`, [newId(), id, uri, now]
    //     );
    // });
    // (p.imageUris ?? []).forEach((uri) => {
    //     db.runSync(
    //         `INSERT INTO IMAGES (project_id, file_path, order_index)
    //         VALUES (?,?,?,?)`, [projectId, uri, now]
    //     );
    // });

    db.execSync("COMMIT");
    console.log("db.execSync commited and finsihed")
    return id;
}

export function deleteProject(id: string): boolean {
    db.execSync("BEGIN");
    db.runSync(`DELETE FROM PROJECTS_USER WHERE id=?`, [id]);
    db.runSync(`DELETE FROM PROMPTS WHERE project_id=?`, [id]);
    // db.runSync(`DELETE FROM prompt_options WHERE projectId=?`, [id])
    db.runSync(`DELETE FROM IMAGES WHERE project_idd=?`, [id])
    db.execSync("COMMIT");
    return true
}


// READ (list)
export function listProjects(): Array<Pick<Project, "id" | "title" | "organization" | "admin" | "description"> & { cover?: string }> 
    { // I need some indicator of how many have been labeled


    // const rows = db.getAllSync<any>(`SELECT id,title,organization,admin_contact,description FROM PROJECTS_USER ORDER BY last_updated DESC`);
    const rows = db.getAllSync<any>(`SELECT id,title,organization,admin_contact,description FROM PROJECTS_USER ORDER BY id DESC`);
    // attach a cover image (first image if exists)
    console.log("calling List Projects, here are the returned rows!!!!!")
    console.log(rows)
    return rows.map((r) => {
        const img = db.getFirstSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY rowid ASC LIMIT 1`, [r.id]);
        return { ...r, cover: img?.uri }; // currently the cover image is pulled from the first image
    });
}

// READ (one, with prompts+options+images)
export function getProject(id: string): Project | null {
    const p = db.getFirstSync<any>(`SELECT * FROM PROJECTS_USER WHERE id=?`, [id]); // select project with matching id
    if (!p) {
        console.log("-- getProject failed with id = ", id);
        return null;
    } 
    const promptRows = db.getAllSync<any>(
        `SELECT * FROM PROMPTS WHERE project_id=? ORDER BY id ASC`, [id] // selct prompts from the projectID
    );
    const prompts: Prompt[] = promptRows.map((pr: any) => {
        const opts = db.getAllSync<any>(
            `SELECT * FROM PROMPT_OPTION WHERE prompt_id=? ORDER BY id ASC`, [pr.id]
        ).map((o: any) => ({ id: o.id, text: o.text }));
        return { id: pr.id, question: pr.question, options: opts, orderIndex: pr.orderIndex };
    });


    // const imageRows = db.getAllSync<any>(
    //     `SELECT * FROM project_images WHERE projectId=?`, [id]
    // )
    // console.log("Images from getProject in projectsRepo.ts: ", imgs)

    const imageRows = db.getAllSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY rowid ASC`, [id]);
    const images = imageRows.map((r: any) => r.uri);
    // const labeled_count = db.getAllSync<any>(`SELECT labeled_count FROM project WHERE projectId=? ORDER BY rowid ASC`, [id]);
    const labeled_count = db.getAllSync<any>(`SELECT labeled_count FROM PROJECTS_USER WHERE id=? ORDER BY rowid ASC`, [id]);
    // console.log("Images from getProject in projectsRepo.ts: ", images)

    return {
        id: p.id,
        title: p.title,
        admin: p.admin,
        organization: p.organization,
        protocolpdf: p.protocolpdf ?? undefined,
        description: p.description ?? undefined,
        images,
        prompts,
        // createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}

// UPDATE (basic fields)
export function updateProject(id: string, changes: Partial<Pick<Project, "title"|"admin"|"organization"|"protocolpdf"|"description">>) {
    const now = Date.now();
    const fields = [];
    const values: any[] = [];
    for (const [k, v] of Object.entries(changes)) {
        fields.push(`${k}=?`);
        values.push(v ?? null);
    }
    fields.push("updatedAt=?");
    values.push(now, id);
    db.runSync(`UPDATE projects SET ${fields.join(",")} WHERE id=?`, values);
}

// MUTATIONS (prompts/images)
export function addPrompt(projectId: string, question: string, options: string[]) {
    const now = Date.now();
    const nextIndex = (db.getFirstSync<any>(`SELECT IFNULL(MAX(orderIndex),-1) + 1 AS idx FROM PROMPTS WHERE projectId=?`, [projectId])?.idx) ?? 0;
    // const promptId = newId();
    db.execSync("BEGIN");
    db.runSync(
        `INSERT INTO prompts (id, projectId, question, orderIndex, updatedAt) VALUES (?,?,?,?,?)`,
        [promptId, projectId, question, nextIndex, now]
    );
    options.forEach((opt, j) => {
        db.runSync(
            `INSERT INTO prompt_options (id, promptId, text, orderIndex, updatedAt) VALUES (?,?,?,?,?)`,
        [newId(), promptId, opt, j, now]
        );
    });
    db.execSync("COMMIT");
}

export function addImage(projectId: string, uri: string) {
    const query = `INSERT INTO project_images (id, projectId, uri, updatedAt, imageAnswers) VALUES (?,?,?,?,?)`;
    const oldQuery = `INSERT INTO project_images (id, projectId, uri, updatedAt) VALUES (?,?,?,?)`;
    const oldValues = [newId(), projectId, uri, Date.now()];
    const values = [newId(), projectId, uri, Date.now(), uri];
    console.log(query, values)
    db.runSync(query, values);
    // db.runSync(oldQuery, oldValues);
    // db.runSync(
    //     `INSERT INTO project_images (id, projectId, uri, updatedAt, imageAnswers) VALUES (?,?,?,?,?)`, [newId(), projectId, uri, Date.now(), uri]
    // );
}

export function deleteImage(projectId: string, uri: string) {
    db.runSync(`DELETE FROM project_images WHERE projectId=? AND uri=?`, [projectId, uri]);
}

export function storeImageAnswers(projectId: string, uri:string, imageAnswers:string) {
    const query = `UPDATE project_images SET imageAnswers=? WHERE projectId=? AND uri=?`
    const insertedData = [imageAnswers, projectId, uri]
    // console.log(query, insertedData)
    db.runSync(query, insertedData)
}
export function checkImageAnswers(projectId: string, uri:string) {
    const query = `SELECT imageAnswers FROM project_images WHERE projectId=? AND uri=?`
    const data = [projectId, uri]
    const answerString = db.getAllSync<any>(query, data)
    // console.log("ANSWERS TO THIS IMAGE:", answerString)
    return answerString
}
