import { body, validationResult } from 'express-validator';

export const validateCreateUser = [
    // Validate 'name' field
    body('name')
        .exists({ checkNull: true })
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be at least 3 characters long and no more than 50 characters long'),

    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];