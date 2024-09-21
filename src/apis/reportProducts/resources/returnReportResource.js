export default class ReturnReportResources {
    constructor(data) {
        return data.map(data => ({
            _id: data._id,
            title: data.title,
            description: data.description,
        }));
    }
}