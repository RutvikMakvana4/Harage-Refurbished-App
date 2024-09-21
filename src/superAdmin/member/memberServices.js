import SubAdmin from "../../../model/subAdmin";
import MemberListResource from "./resources/memberListResource";

class memberServices {

    /**
     * @description: members list
     * @param {*} req 
     * @param {*} res 
     */
    static async memberList(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        // const memberList = await SubAdmin.find({ assignRoles: "Acquisition Manager" })
        // console.log(memberList);

        const allRoles = ["Acquisition Manager", "Product Manager", "Order Manager", "Customer Support Specialist"];
        const subsetRoles = ["Acquisition Manager", "Order Manager"];

        let pipeline = [
            {
                $facet: {
                    fullAccess: [
                        { $match: { assignRoles: { $all: allRoles } } },
                        { $addFields: { accessType: "FA" } }
                    ],
                    orderManagerAccess: [
                        { $match: { assignRoles: { $all: subsetRoles } } },
                        {
                            $redact: {
                                $cond: {
                                    if: { $setIsSubset: [allRoles, "$assignRoles"] },
                                    then: "$$PRUNE",
                                    else: "$$KEEP"
                                }
                            }
                        },
                        { $addFields: { accessType: "OM" } }
                    ]
                }
            },
            {
                $project: {
                    combinedResults: { $concatArrays: ["$fullAccess", "$orderManagerAccess"] }
                }
            },
            { $unwind: "$combinedResults" },
            { $replaceRoot: { newRoot: "$combinedResults" } },
        ]

        const totalDocument = await SubAdmin.aggregate(pipeline);

        pipeline.push({ $skip: page * pageLimit }, { $limit: pageLimit });
        const results = await SubAdmin.aggregate(pipeline);

        const meta = {
            total: totalDocument.length,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument.length / pageLimit),
        }

        return { data: new MemberListResource(results), meta };
    }

}

export default memberServices;