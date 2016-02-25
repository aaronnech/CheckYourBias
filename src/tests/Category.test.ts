import Category = require('../common/Category');
import Constants = require('../client/Constants')

Constants.firebaseUrl = Constants.FIREBASE_URL_TEST;

class CategoryTest {
	/*
		Gets a category and makes sure that it has the correct name
	*/
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
	
	/*
		Gets all the categories and makes sure it has the right name
	*/
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