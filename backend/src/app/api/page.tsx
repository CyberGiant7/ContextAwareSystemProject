import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "@/components/react_swagger";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'API Docs',
    description: 'API Documentation with Swagger for Nextjs',
};


export default async function IndexPage() {
    const spec = await getApiDocs();

    return (
        <section className="container">
            <ReactSwagger spec={spec} />
        </section>
    );
}