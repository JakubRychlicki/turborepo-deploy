import ejs from "ejs";
import fs from "fs";
import juice from "juice";

const templateUrl = new URL("./templates/template.ejs", import.meta.url);

export async function renderEmail(
  data: Record<string, any>
): Promise<string> {
  const templateContent = fs.readFileSync(templateUrl, "utf8");
  const preInlined = ejs.render(templateContent, {
    ...data,
    cta: data.cta || {},
  });

  return juice(preInlined);
}
