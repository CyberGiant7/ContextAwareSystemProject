'use client';
import 'swagger-ui-react/swagger-ui.css';
import dynamic from "next/dynamic";

type Props = {
    spec: Record<string, any>;
};

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});


export default function ReactSwagger({spec}: Props) {
    // return <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json"/>
    return <SwaggerUI spec={spec}/>;
}
