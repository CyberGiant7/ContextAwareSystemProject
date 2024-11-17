import {createSwaggerSpec} from 'next-swagger-doc';

/**
 * Generates the Swagger API documentation specification.
 *
 * @returns {Promise<object>} The Swagger specification object.
 */
export const getApiDocs = async () => {
    return createSwaggerSpec({
        apiFolder: 'src/app/api',
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Docs',
                version: '1.0.0',
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: []
        },
    });
};
