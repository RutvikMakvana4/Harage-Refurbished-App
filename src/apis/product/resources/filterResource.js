export default class FilterResource {
    constructor(data) {

        this.brand = data.brand !== null ? data.brand : null,
        this.color = data.color !== null ? data.color : null

    }
}