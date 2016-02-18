import Category = require('../common/Category');
import Constants = require('../client/Constants')

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

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
	
	public static testGetAllCategories(test) {
		Category.getAllCategories(function(catList) {
			test.strictEqual(
				catList[0].categoryName,
				'Education',
				'Category with id 0 should have categoryName == \'Education\''
			);
			test.done();
		});
	}
}

export = CategoryTest;