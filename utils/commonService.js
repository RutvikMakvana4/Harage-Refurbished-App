/**
 * @description exports all database related methods
 */

class commonService {
    /*
     * @description : Create any record in mongodb database
     * @param {object} model : mongodb model
     * @param {object} data : {}
     * @returns {object} result : database result
     */
    static async createOne(model, data) {
        const result = await model.create(data);
        return result;
    }

    /*
     * @description : find single record from table by query
     * @param  {object} model : mongodb model
     * @param  {object} query : {}
     * @param {object} options : {}
     * @return {object} result : database result
     */
    static async findOne(model, query) {
        const result = await model.findOne(query);
        return result;
    }

    /*
     * @description : find all records in database
     * @param  {object} model : mongodb model
     * @param  {object} query : {}
     * @param {object} options : {}
     * @return {object} result : database result
     */
    static async findAllRecords(model, query, options = {}) {
        const result = await model.find(query);
        return result;
    }

    /*
     * @description : find single id from table by query
     * @param  {object} model : mongodb model
     * @param  {object} query : {}
     * @param {object} options : {}
     * @return {object} result : database result
     */
    static async findById(model, query) {
        const result = await model.findById(query);
        return result;
    }

    /*
     * @description : delete any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */
    static async findOneAndDelete(model, data) {
        const result = await model.findOneAndDelete(data);
        return result;
    }

    /*
     * @description : find one and update any record in database by primary key
     * @param {*} model
     * @param {*} id
     * @param {*} data
     * @returns
     */
    static async findOneAndUpdate(model, id, data) {
        const result = await model.findOneAndUpdate(id, data);
        return result;
    }

    /*
     * @description : update any record in database by primary key
     * @param {*} model
     * @param {*} id
     * @param {*} data
     * @returns
     */
    static async updateById(model, id, data) {
        const result = await model.findByIdAndUpdate(id, data, { new: true });
        return result;
    }

    /*
     * @description : delete any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */
    static async deleteById(model, id) {
        const result = await model.findByIdAndDelete(id);
        return result;
    }

    /*
     * @description : delete multiple any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */
    static async deleteMany(model, id) {
        const result = await model.deleteMany(id);
        return result;
    }

    /*
     * @description : Insert multiple any record in database by primary key
     * @param  {object} model : mongodb model
     * @param  {object} pk : primary field of table
     * @return {object} result : database result
     */
    static async insertMany(model, data) {
        const result = await model.insertMany(data);
        return result;
    }

    /*
     * @description : total collection data find(20)
     * @param {*} model
     * @param {*} id
     * @param {*} data
     * @returns
     */
    static async totalDocuments(model, data) {
        const result = await model.countDocuments(data);
        return result;
    }

    /*
     * @description : Count total record in database
     * @param {*} model
     * @param {*} id
     * @param {*} data
     * @returns
     */
    static async count(model, data) {
        const result = await model.count(data);
        return result;
    }
}

export default commonService;
