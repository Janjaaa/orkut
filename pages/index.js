import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

function ProfileSidebar(propriedades){
  return (
    <Box as='aside'>
      <img src={ `https://github.com/${propriedades.githubUser}.png` } style={{ borderRadius: '5px'}}/>
      <hr />
      <p>
        <a className='boxLink' href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}
function ProfileRelationsBox (propriedades){
  const listaSeguidores = propriedades.items.slice(0, 6)
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      {
      <ul>
        { listaSeguidores.map((seguidor)=> {
          return (
            <li key={seguidor.id}>
              <a href={`/users/${seguidor.login}`} >
                <img src={seguidor.avatar_url} />
                <span>{seguidor.login}</span>
              </a>
            </li>
          )
        })}
      </ul> }
    </ProfileRelationsBoxWrapper>
  )


}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades]= React.useState([{
   
  
  }]);
  
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'filipedeschamps'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {
    // GET
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })

   // API GraphQL
   fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': 'bc092c3c9a260ee8eaa8f7951dbbb7',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ "query": `query {
      allCommunities {
        id 
        title
        imageUrl
        link
        creatorSlug
      }
    }` })
  })
  .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
  .then((respostaCompleta) => {
    const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
    console.log(comunidadesVindasDoDato)
    setComunidades(comunidadesVindasDoDato);
  })
  // .then(function (response) {
  //   return response.json()
  // })

  }, [])

  return (
    <>
    <AlurakutMenu githubUser ={githubUser}/>
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className='title'>
            Bem vindo(a), {githubUser}
          </h1>

          <OrkutNostalgicIconSet></OrkutNostalgicIconSet>

        </Box>
        <Box>
          <h2 className='subTitle'>O que você deseja fazer?</h2>
          <form onSubmit={function handleCreateCommunity(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            const comunidade ={
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              link: dadosDoForm.get('link'),
              creatorSlug: githubUser,
            }

            fetch('./api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json();
              const comunidade = dados.registroCriado;
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            })

          }}>

            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />

            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa"
              />

            </div>
            <div>
              <input 
                placeholder="Onde isso irá nos levar?" 
                name="link" 
                aria-label="Onde isso irá nos levar?" 
              />

            </div>

            <button>
              Criar comunidade
            </button>
          </form>

        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>
        
        <ProfileRelationsBox title='Seguidores' items={seguidores}/>


        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Influencers ({pessoasFavoritas.length})
          </h2>

          <ul>
            {pessoasFavoritas.map((itemAtual)=> {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`} >
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>

          <h2 className='smallTitle'>
            Comunidades({comunidades.length})
          </h2>
          <ul>
            {comunidades.map((itemAtual)=> {
              return (
                <li id={itemAtual.id}>
                  <a href={itemAtual.link} target='_blank'>
                    <img src={itemAtual.imageUrl} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
    
  
  )
}


export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      
    }
    
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}