export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        "^.+\\.worker.[t|j]sx?$": "workerloader-jest-transformer"
    },
    coverageDirectory: '.coverage',
};
