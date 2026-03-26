import password from '@/routes/password';

export const formRules: Record<string, string[]> = {
    username: [
        'Min. of 5 characters',
        'Max. of 15 characters',
        'Only letter and numbers are allowed',
        'Must contain letters, not just numbers',
    ],
    full_name: [
        'Must be at least 5 characters long.',
        'No special characters except spaces are allowed.',
    ],
    email: ['Must be a valid email address'],
    password: [
        'Must be at least 8 characters long',
        'Must have at least 1 lowercase letter',
        'Must have at least 1 uppercase letters',
        'Must have at least 1 number',
        'Must have at least 1 special character',
    ],
    password_confirmation: ['Must match password'],
};
