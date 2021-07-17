import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response){

    if(request.method === 'POST'){

        const TOKEN = '28d12cf5431f063b72a7a480de2603'

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create ({
            itemType: '970849',

            ...request.body,
            // title: 'Comunidade de teste',
            // imageUrl: 'https://github.com/janjaaa.png',
            // link: 'https://github.com/janjaaa',
            // creatorSlug: 'janjaaa'
        })
        console.log(registroCriado);

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })

        return;
    }


    response.status(404).json ({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}