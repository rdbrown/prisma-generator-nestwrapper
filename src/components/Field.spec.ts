import { FieldComponent } from "./Field";

describe("Test Field Component", () => {
    it("trys", () => {
        const t = new FieldComponent({
            name: "id",
            type: "Int"
        });
        console.log("try", t);
        expect(t).toBeDefined();
    });

    it("trys string", () => {
        const t = new FieldComponent({
            name: "id",
            type: "Int"
        });
        console.log("try", t.fieldToStringTemplate());
        expect(t).toBeDefined();
    });
});
