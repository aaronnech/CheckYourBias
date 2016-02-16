import Category = require('../common/Category');

class CategoryTest {
	public static testCategoryValues(test) {
		Category.getCategory("0", function(category: Category) {
			test.strictEqual(
				category.categoryName,
				'Education',
				'Category with id 0 should have categoryName == \'Education\''
			);
			test.done();
		});
	}
}

export = CategoryTest;