export default class AdminCategoryResource {
    constructor(items) {
        return items.map(data => ({
            name: data.name,
        }))
    }
}