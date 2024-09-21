export default class SubCategoryResource {
  constructor(items) {
    return items.map((data) => ({
      _id: data._id,
      name: data.name,
      isSubSubCategory: data.isSubSubCategory,
      formData: JSON.parse(data.formData),
      buyerData: JSON.parse(data.buyerData),
      subSubCategories: data.subSubCategories
        ? data.subSubCategories.map((data1) => ({
            _id: data1._id,
            name: data1.name,
            formData: JSON.parse(data1.formData),
            buyerData: JSON.parse(data1.buyerData),
          }))
        : null,
    }));
  }
}