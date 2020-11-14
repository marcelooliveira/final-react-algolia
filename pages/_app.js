import "bootstrap/dist/css/bootstrap.css";
import '../styles/globals.css'
import '../components/CustomAutocomplete.css';
import { client as faunadbClient, q } from '../config/db'
import { data as staticData } from '../data/data.js'
import algoliasearch from 'algoliasearch';

function MyApp({ Component, pageProps }) {

  loadFaunadbData();

  return <Component {...pageProps} />
}

export default MyApp

function loadFaunadbData() {
  faunadbClient
    .query(
      q.Paginate(
        q.Match(
          q.Ref('indexes/houses')))
    )
    .then((response) => {
      
      const refs = response.data;
      
      const getAllDataQuery = refs.map((ref) => {
        return q.Get(ref);
      });
      // query the refs
      return faunadbClient.query(getAllDataQuery).then((data) => {
        if (data.length == 0) {
          importStaticDataIntoFaunaDB(faunadbClient)
          .then((ret) => console.log(ret))
        }
        else {
          indexFaunaDataIntoAlgolia(data);
        }
      });
    })
    .catch((error) => console.log('error: ', error.message));
}

function importStaticDataIntoFaunaDB(faunadbClient) {

  console.log('');
  console.log('importing static data into FaunaDB...');
  console.log('=====================================');  
  
  return faunadbClient.query(
    q.Map(
      staticData,
      q.Lambda(
        'house',
        q.Create(
          q.Collection('houses'),
          { data: q.Var('house') }
        )
      )
    )
  );
}

function indexFaunaDataIntoAlgolia(data) {
  
  const SearchClient = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
  const index = SearchClient.initIndex("houses");

  index.getObjects(['1']).then(({ results }) => {

    if(results[0] === null) {

      console.log('');
      console.log('indexing FaunaDB data into Algolia...');
      console.log('=====================================');
      
      const objects = data.map((d) => ({
        objectID: d.data.number,
        number: d.data.number,
        price: d.data.price,
        address: d.data.address,
        pic: d.data.pic,
        bedrooms: d.data.bedrooms,
        bathrooms: d.data.bathrooms,
        cars: d.data.cars
      })
      );      
      
      index
        .saveObjects(objects)
        .then(({ objectIDs }) => {
          console.log(objectIDs);
        });
    }
  });
}
