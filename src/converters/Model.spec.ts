const testData = {
    name: "Book",
    dbName: null,
    fields: [
        {
            name: "createdAt",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "DateTime",
            default: { name: "now", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BReadOnly\n@BCreatedAt"
        },
        {
            name: "id",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: true,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "Int",
            default: { name: "autoincrement", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BPk"
        },
        {
            name: "isPrimary",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "Boolean",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "name",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: true,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "owner",
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "User",
            relationName: "BookToUser",
            relationFromFields: ["ownerId"],
            relationToFields: ["id"],
            isGenerated: false,
            isUpdatedAt: false,
            documentation:
                "@DtoRelationRequired\n@DtoRelationCanCreateOnCreate\n@DtoRelationCanConnectOnCreate"
        },
        {
            name: "ownerId",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "primaryCurrencyCode",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "updatedAt",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "DateTime",
            isGenerated: false,
            isUpdatedAt: true,
            documentation: "@DtoReadOnly"
        }
    ],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    isGenerated: false
};

const noUpdatedData = {
    name: "Book",
    dbName: null,
    fields: [
        {
            name: "createdAt",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "DateTime",
            default: { name: "now", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BReadOnly\n@BCreatedAt"
        },
        {
            name: "id",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: true,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "Int",
            default: { name: "autoincrement", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BPk"
        },
        {
            name: "isPrimary",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "Boolean",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "name",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: true,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "owner",
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "User",
            relationName: "BookToUser",
            relationFromFields: ["ownerId"],
            relationToFields: ["id"],
            isGenerated: false,
            isUpdatedAt: false,
            documentation:
                "@DtoRelationRequired\n@DtoRelationCanCreateOnCreate\n@DtoRelationCanConnectOnCreate"
        },
        {
            name: "ownerId",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "primaryCurrencyCode",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        }
    ],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    isGenerated: false
};

describe("Test the Model Generator", () => {
    test("Checks Updated and Created exists", () => {
        const fieldNames = noUpdatedData.fields.map((f) => f.name);

        const t = fieldNames.map((f) => f);

        const cAt = fieldNames.includes("createdAt");
        const uAt = fieldNames.includes("updatedAt");
        expect(uAt).toBe(false);
    });

    test("testers", () => {
        const fieldNames = testData.fields.map((f) => f.name);
        console.log(`testfieldnames: ${JSON.stringify(testData.fields)}`);
    });
});

const i = {
    testfieldnames: [
        {
            name: "createdAt",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "DateTime",
            default: { name: "now", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BReadOnly\n@BCreatedAt"
        },
        {
            name: "id",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: true,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "Int",
            default: { name: "autoincrement", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "@BPk"
        },
        {
            name: "isPrimary",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "Boolean",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "name",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: true,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "owner",
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "User",
            relationName: "BookToUser",
            relationFromFields: ["ownerId"],
            relationToFields: ["id"],
            isGenerated: false,
            isUpdatedAt: false,
            documentation:
                "@DtoRelationRequired\n@DtoRelationCanCreateOnCreate\n@DtoRelationCanConnectOnCreate"
        },
        {
            name: "ownerId",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "primaryCurrencyCode",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "updatedAt",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "DateTime",
            isGenerated: false,
            isUpdatedAt: true,
            documentation: "@DtoReadOnly"
        }
    ]
};
