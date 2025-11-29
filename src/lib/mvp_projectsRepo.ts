// lib/projectsRepo.ts
// import { db, newId } from "./db";
import { db } from "./mvp_db";

export type Prompt = { id: string; question: string; options: { id: string; text: string }[]; orderIndex: number };
export type Project = {
    id: number;
    title: string;
    admin_contact: string;
    organization: string;
    description?: string;
    protocol_pdf?: string;
    allowed_contributors?: string;
    prompts: Prompt[];
    images: string[]; // URIs (file://…)
    last_updated: string;
};
// CREATE
export function createProject(p: {
    title: string;
    admin_contact: string;
    organization: string;
    protocol_pdf?: string;
    description?: string;
    prompts?: { question: string; options: string[] }[];
    imageUris?: string[];
}): number {
    console.log("beggining of create project database funnction")
    const now = Date.now();
    // console.log("date added")
    db.execSync("BEGIN");
    // console.log("db.execSync called")
    db.runSync(
        `INSERT INTO PROJECTS_USER (title,admin_contact,organization,protocol_pdf,description,last_updated,labeled_count)
        VALUES (?,?,?,?,?,?,?)`, [p.title, p.admin_contact, p.organization, p.protocol_pdf ?? null, p.description ?? null, now, 0]
    );
    const row = db.getFirstSync<{ id: number }>(
        "SELECT last_insert_rowid() AS id"
    );
    if (!row) {
        throw new Error("Could not retrieve last inserted project ID");
    }
    const inserted_project_id = row.id;
    (p.prompts ?? []).forEach((pr, i) => {

        // const projectId = row.id;
        db.runSync(
            `INSERT INTO PROMPTS (project_id, question_text)
            VALUES (?,?)`, [inserted_project_id, pr.question]
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
    return inserted_project_id;
}

export function deleteProject(id: number): boolean {
    db.execSync("BEGIN");
    // need to delete in reverse foreign key reliant order
    db.runSync(`DELETE FROM LABEL_RESPONSES WHERE project_id=?`, [id]);
    db.runSync(`
        DELETE FROM PROMPT_OPTION 
        WHERE prompt_id IN (SELECT id FROM PROMPTS WHERE project_id=?)
    `, [id]);
    db.runSync(`DELETE FROM IMAGES WHERE project_id=?`, [id]);
    db.runSync(`DELETE FROM PROMPTS WHERE project_id=?`, [id]);
    // Now there is nothing reliant on the project, I can delete it without leaving dangles
    db.runSync(`DELETE FROM PROJECTS_USER WHERE id=?`, [id]); 
    db.execSync("COMMIT");
    return true;
}


// READ (list)
export function listProjects(): Array<Pick<Project, "id" | "title" | "organization" | "admin_contact" | "description"> & { cover?: string }> 
    { // I need some indicator of how many have been labeled


    // const rows = db.getAllSync<any>(`SELECT id,title,organization,admin_contact,description FROM PROJECTS_USER ORDER BY last_updated DESC`);
    const rows = db.getAllSync<any>(`SELECT id,title,organization,admin_contact,description FROM PROJECTS_USER ORDER BY id DESC`);
    // attach a cover image (first image if exists)
    console.log("calling List Projects, here are the returned rows!!!!!")
    console.log(rows)

    return rows.map((r) => {
        const labeledCount = getLabeledImageCount(r.id);
        const img = db.getFirstSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY rowid ASC LIMIT 1`, [r.id]);
        const totalImages = db.getFirstSync<{ count: number }>(
            "SELECT COUNT(*) AS count FROM IMAGES WHERE project_id=?",
            [r.id]
        )?.count ?? 0;

        return {
            ...r,
            cover: img?.file_path,
            progress: `${labeledCount}/${totalImages}`
        };

        // const img = db.getFirstSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY rowid ASC LIMIT 1`, [r.id]);
        // return { ...r, cover: img?.uri }; // currently the cover image is pulled from the first image
    });
}

// READ (one, with prompts+options+images)
export function getProject(id: number): Project | null {
    const p = db.getFirstSync<any>(`SELECT * FROM PROJECTS_USER WHERE id=?`, [id]); // select project with matching id
    if (!p) {
        console.log("-- getProject failed with id = ", id);
        return null;
    } 
    const promptRows = db.getAllSync<any>(
        `SELECT * FROM PROMPTS WHERE project_id=? ORDER BY id ASC`, [id] // selct prompts from the projectID
    );
    console.log("Retrieving matching prompts from getProjec(). Prompt rows =", promptRows)
    // const promptOptionRows = db.getAllSync<any>(
    //     `SELECT * FROM PROMPT_OPTION WHERE prompt_id=? ORDER BY id ASC`, [promptRows] 
    // );
    const prompts: Prompt[] = promptRows.map((pr: any) => {
        const opts = db.getAllSync<any>(
            `SELECT * FROM PROMPT_OPTION WHERE prompt_id=? ORDER BY id ASC`, [pr.id]
        ).map((o: any) => ({ id: o.id, text: o.text }));
        console.log("PROMPT CHOICE OUTPUT from getProject(). options=", opts)
        return { id: pr.id, question: pr.question, options: opts, orderIndex: pr.orderIndex };
    });


    const imageRows = db.getAllSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY id ASC`, [id]);
    const images = imageRows.map((r: any) => r.file_path);
    console.log("mvp_projectsRepo.getProject().. retrieved image list for project:",  imageRows)
    // const labeled_count = db.getAllSync<any>(`SELECT labeled_count FROM project WHERE projectId=? ORDER BY rowid ASC`, [id]);
    const labeled_count = db.getAllSync<any>(`SELECT labeled_count FROM PROJECTS_USER WHERE id=? ORDER BY rowid ASC`, [id]);
    // console.log("Images from getProject in projectsRepo.ts: ", images)

    return {
        id: p.id,
        title: p.title,
        admin_contact: p.admin_contact,
        organization: p.organization,
        protocol_pdf: p.protocol_pdf ?? undefined,
        description: p.description ?? undefined,
        images,
        prompts,
        // createdAt: p.createdAt,
        last_updated: p.updatedAt,
    };
}

// UPDATE (basic fields)
export function updateProject(id: number, changes: Partial<Pick<Project, "title"|"organization"|"admin_contact"|"protocol_pdf"|"description">>) {
    const now = Date.now();
    const fields = [];
    const values: any[] = [];
    console.log("CHANGES FIELDS::::", Object.entries(changes))
    for (const [k, v] of Object.entries(changes)) {
        fields.push(`${k}=?`);
        values.push(v ?? null);
    }
    fields.push("last_updated=?");
    values.push(now, id);
    db.runSync(`UPDATE PROJECTS_USER SET ${fields.join(",")} WHERE id=?`, values);
}

export function addPrompt(project_id: number, question: string, options: string[]) {
    const now = Date.now();
    // const nextIndex = (db.getFirstSync<any>(`SELECT IFNULL(MAX(orderIndex),-1) + 1 AS idx FROM PROMPTS WHERE projectId=?`, [project_id])?.idx) ?? 0;
    // const promptId = newId();
    db.execSync("BEGIN");
    db.runSync(
        `INSERT INTO PROMPTS (project_id, question_text) VALUES (?,?)`, [project_id, question]
    );
    const row = db.getFirstSync<{ id: number }>(`SELECT last_insert_rowid() AS id`);
    if (row == null) {
        throw new Error("Could not retrieve last inserted prompt ID");
    }
    const prompt_id = row.id;
    // TODO:: get the id for the last added entry (this prompt), I'll need it for the foreign key for the answer options
    options.forEach((opt, j) => {
        db.runSync(
            // `INSERT INTO prompt_options (id, promptId, text, orderIndex, updatedAt) VALUES (?,?,?,?,?)`,
            `INSERT INTO PROMPT_OPTION (prompt_id, option_text, order_index) VALUES (?,?,?)`, [prompt_id, opt, j]
        );
    });
    db.execSync("COMMIT");
}
export function getImages(project_id:number) {
    const imageRows = db.getAllSync<any>(`SELECT file_path FROM IMAGES WHERE project_id=? ORDER BY id ASC`, [project_id]);
    const images = imageRows.map((r: any) => r.file_path);
    console.log("mvp_projectsRepo.getProject().. retrieved image list for project:",  imageRows)
}

// export function addImage(projectId: string, uri: string) {
export function addImage(projectId: number, uri: string) {
    db.execSync("BEGIN");
    console.log("Trying to insert an image in mvp_projectsRepo.addImage()... projectID, uri = ", projectId, uri)
    db.runSync(`INSERT INTO IMAGES (project_id, file_path) VALUES (?,?)`, [projectId, uri])
    db.execSync("COMMIT");
    // const query = `INSERT INTO project_images (id, projectId, uri, updatedAt, imageAnswers) VALUES (?,?,?,?,?)`;
    // const oldQuery = `INSERT INTO project_images (id, projectId, uri, updatedAt) VALUES (?,?,?,?)`;
    // const oldValues = [newId(), projectId, uri, Date.now()];
    // const values = [newId(), projectId, uri, Date.now(), uri];
    // console.log(query, values)
    // db.runSync(query, values);
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

export function getPromptOptions(project_id:number) {
    const prompt_options = db.getAllSync<any>(`SELECT * FROM PROMPTS WHERE project_id=?`, [project_id]); // select project with matching id
    console.log("Retrieved PROMPTS in nvp_projectsRepo.getPromptOptions()... output = ", prompt_options)
    if (prompt_options == null) {
        throw new Error("Could not retrieve last inserted prompt ID");
    }
    // prompt_options.forEach((retrieved_prompt) => {
    //     getPromptAnswerChoices(retrieved_prompt.id)
    // })
    return prompt_options
}
export function getPromptAnswerChoices(prompt_id: number) {
    const answer_options = db.getAllSync<any>(`SELECT * FROM PROMPT_OPTION WHERE prompt_id=?`, [prompt_id]);
    console.log("Retrieved PROMPT_OPTIONS in nvp_projectsRepo.getAnswerChoices... output = ", answer_options)
    return answer_options
}

// chatgpt helper functions that I should use for the labeling screen--------------------------------------------
export function getPromptsWithOptions(project_id: number) {
    const prompts = db.getAllSync<any>(
        `SELECT id, question_text FROM PROMPTS WHERE project_id=? ORDER BY id ASC`,
        [project_id]
    );

    return prompts.map((pr: any) => {
        const options = db.getAllSync<any>(
            `SELECT id, option_text FROM PROMPT_OPTION WHERE prompt_id=? ORDER BY order_index ASC`,
            [pr.id]
        );

        return {
            id: pr.id,
            question: pr.question_text,
            options: options.map((o: any) => ({ id: o.id, text: o.option_text }))
        };
    });
}

export function saveLabelResponses(project_id: number, image_id: number, selectedOptions: number[]) {
    db.execSync("BEGIN");

    // Remove previous answers for this image
    db.runSync(
        `DELETE FROM LABEL_RESPONSES WHERE project_id=? AND image_id=?`,
        [project_id, image_id]
    );

    // Insert new answers
    selectedOptions.forEach((option_id: number) => {
        db.runSync(
            `INSERT INTO LABEL_RESPONSES (project_id, image_id, selected_answer)
            VALUES (?,?,?)`,
            [project_id, image_id, option_id]
        );
    });

    db.execSync("COMMIT");
}
export function getImagesForProject(project_id: number) {
    return db.getAllSync<any>(
        `SELECT id, file_path FROM IMAGES WHERE project_id=? ORDER BY order_index ASC`,
        [project_id]
    );
}
export function getLabeledImageCount(project_id: number) {
    const row = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(DISTINCT image_id) AS count
        FROM LABEL_RESPONSES
        WHERE project_id=?`,
        [project_id]
    );
    return row?.count ?? 0;
}

export function getFirstUnlabeledImage(project_id: number) {
    const row = db.getFirstSync<{ id: number }>(
        `
        SELECT id 
        FROM IMAGES 
        WHERE project_id=? 
        AND id NOT IN (
            SELECT DISTINCT image_id 
            FROM LABEL_RESPONSES 
            WHERE project_id=?
        )
        ORDER BY id ASC
        LIMIT 1
        `,
        [project_id, project_id]
    );

    return row?.id ?? null;
}

export function getCoverImageForProject(project_id: number) {
    return db.getFirstSync<any>(
        `SELECT id, file_path FROM IMAGES WHERE project_id=? ORDER BY order_index ASC`, [project_id]
    );
}