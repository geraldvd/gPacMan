// Tests for Utils module

TestRunner
    .suite('Utils')
    .test('DIRECTIONS constants are defined', () => {
        assert.notNull(Utils.DIRECTIONS.UP);
        assert.notNull(Utils.DIRECTIONS.DOWN);
        assert.notNull(Utils.DIRECTIONS.LEFT);
        assert.notNull(Utils.DIRECTIONS.RIGHT);
        assert.notNull(Utils.DIRECTIONS.NONE);
    })
    .test('rectCollision detects overlapping rectangles', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 5, y: 5, width: 10, height: 10 };
        const rect3 = { x: 20, y: 20, width: 10, height: 10 };
        
        assert.true(Utils.rectCollision(rect1, rect2), 'Should detect overlap');
        assert.false(Utils.rectCollision(rect1, rect3), 'Should not detect non-overlap');
    })
    .test('pointInRect detects point inside rectangle', () => {
        const rect = { x: 0, y: 0, width: 10, height: 10 };
        const pointInside = { x: 5, y: 5 };
        const pointOutside = { x: 15, y: 15 };
        
        assert.true(Utils.pointInRect(pointInside, rect), 'Point should be inside');
        assert.false(Utils.pointInRect(pointOutside, rect), 'Point should be outside');
    })
    .test('distance calculates correct distance between points', () => {
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 3, y: 4 };
        
        assert.equals(Utils.distance(p1, p2), 5, 'Distance should be 5');
    })
    .test('gridToPixel converts coordinates correctly', () => {
        const result = Utils.gridToPixel(2, 3, 20);
        assert.equals(result.x, 40);
        assert.equals(result.y, 60);
    })
    .test('pixelToGrid converts coordinates correctly', () => {
        const result = Utils.pixelToGrid(45, 65, 20);
        assert.equals(result.x, 2);
        assert.equals(result.y, 3);
    })
    .test('clamp restricts values within range', () => {
        assert.equals(Utils.clamp(5, 0, 10), 5, 'Value within range');
        assert.equals(Utils.clamp(-5, 0, 10), 0, 'Value below range');
        assert.equals(Utils.clamp(15, 0, 10), 10, 'Value above range');
    })
    .test('getOppositeDirection returns correct opposites', () => {
        assert.equals(Utils.getOppositeDirection(Utils.DIRECTIONS.UP), Utils.DIRECTIONS.DOWN);
        assert.equals(Utils.getOppositeDirection(Utils.DIRECTIONS.DOWN), Utils.DIRECTIONS.UP);
        assert.equals(Utils.getOppositeDirection(Utils.DIRECTIONS.LEFT), Utils.DIRECTIONS.RIGHT);
        assert.equals(Utils.getOppositeDirection(Utils.DIRECTIONS.RIGHT), Utils.DIRECTIONS.LEFT);
    })
    .test('randomInt generates integers within range', () => {
        for (let i = 0; i < 100; i++) {
            const result = Utils.randomInt(1, 5);
            assert.true(result >= 1 && result <= 5 && Number.isInteger(result));
        }
    })
    .test('randomChoice selects from array', () => {
        const choices = ['a', 'b', 'c'];
        for (let i = 0; i < 100; i++) {
            const result = Utils.randomChoice(choices);
            assert.true(choices.includes(result));
        }
    });