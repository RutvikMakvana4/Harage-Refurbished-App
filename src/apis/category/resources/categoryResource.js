export default class CategoryResource {
    constructor(items, totalItems) {
        return {
            categories: items.map(data => ({
                _id: data._id,
                image: data.image !== null ? data.image : null,
                name: data.name,
                formData: JSON.parse(data.formData),
                buyerData: JSON.parse(data.buyerData)
            })),
            totalItems: totalItems ? totalItems : 0
        };
    }
}