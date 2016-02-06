class TestSystemTest {
	public static testEqualNumbers(test) {
		test.strictEqual(
			420,
			421,
			'Numbers should be equal'
		);

		test.done();
	}
}

export = TestSystemTest;