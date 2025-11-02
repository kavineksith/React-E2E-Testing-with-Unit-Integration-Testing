export const validation = {
    validateName(name) {
        if (!name || name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (name.length > 50) {
            return 'Name cannot exceed 50 characters';
        }
        return null;
    },

    validateEmail(email) {
        // Updated regex to properly reject emails with spaces and ensure valid format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Check for whitespace
        if (!email || email.includes(' ')) {
            return 'Please provide a valid email address';
        }
        
        if (!emailRegex.test(email)) {
            return 'Please provide a valid email address';
        }
        
        if (email.length > 100) {
            return 'Email cannot exceed 100 characters';
        }
        
        return null;
    },

    validatePassword(password, isRequired = true) {
        if (!password && !isRequired) {
            return null;
        }

        if (!password) {
            return 'Password is required';
        }

        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return 'Password must contain uppercase, lowercase, digit, and special character';
        }

        return null;
    },

    validateForm(formData, mode) {
        const errors = {};

        const nameError = this.validateName(formData.name);
        if (nameError) errors.name = nameError;

        const emailError = this.validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const passwordError = this.validatePassword(
            formData.password,
            mode === 'create'
        );
        if (passwordError) errors.password = passwordError;

        return errors;
    }
};