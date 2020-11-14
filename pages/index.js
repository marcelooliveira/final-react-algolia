import {Row, Col} from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import { faHome as fasHome, faBed as fasBed, faBath as fasBath, faCar as fasCar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { default as NumberFormat } from 'react-number-format';
import useSWR from 'swr'
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Configure,
  Highlight
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { CustomAutocomplete } from './CustomAutocomplete';

const fetcher = (url) => fetch(url).then((r) => r.json());

const Home = () => {
  const { data, error } = useSWR('/api/houses', fetcher);

  if (error) return <div>failed to load</div>;
  
  const searchClient = algoliasearch(
    'TDH1HFPX5P', 
    '18fd8d17c49d229394f6e39ef04a33c3'
  );
  
  function selectHandler(e, obj) {
    alert('you selected: ' + obj.address);
  }

  return (
    <div className="component-container p-4">
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/algolia-min.css"></link>
      </Head>
      <h1 className="title m-0 p-2">
      <FontAwesomeIcon icon={fasHome} />
        &nbsp;Your New Home&nbsp;
      <FontAwesomeIcon icon={fasHome} />
      </h1>

      <div className="center-panel">
        <InstantSearch indexName="houses" searchClient={searchClient}>
          <Configure hitsPerPage={8} />
          <div className="center-panel">
            {/* <SearchBox /> */}
            <CustomAutocomplete selected={selectHandler} />
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    </div>
  )
}

function Hit(props) {
  return (
      <Card className="shadow">
        <img src={props.hit.pic} className="card-img-top img-estate" />
        <Card.Body>
          <h5 className="card-title">
            <NumberFormat value={props.hit.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            <FontAwesomeIcon icon={farHeart} className="text-danger float-right" />
          </h5>
          <h6><Highlight hit={props.hit} attribute="address"/></h6>
          <h6 className="description">
              <FontAwesomeIcon icon={fasBed} />
              <span>&nbsp;{props.hit.bedrooms}&nbsp;</span>
              <FontAwesomeIcon icon={fasBath} />
              <span>&nbsp;{props.hit.bathrooms}&nbsp;</span>
              <FontAwesomeIcon icon={fasCar} />
              <span>&nbsp;{props.hit.cars}&nbsp;</span>
          </h6>
        </Card.Body>
      </Card>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Home