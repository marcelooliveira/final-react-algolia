import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import { faBed as fasBed, faBath as fasBath, faCar as fasCar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as NumberFormat } from 'react-number-format';
import { SearchBox, connectAutoComplete } from 'react-instantsearch-dom';

const Autocomplete = ({ hits, currentRefinement, refine, selected }) => {

  function selectHandler(e, obj) {
    refine(obj.address);
    if (selected) {
      selected(e, obj);
    }
  }

  return (
  <div>
    <SearchBox currentRefinement={currentRefinement} />
    <ul className="autocomplete">
      {currentRefinement ? hits.map(hit => (
        <li key={hit.objectID} className="autocomplete-item" onClick={() => selectHandler(this, hit)}>
          <div className="card card-autocomplete flex-row flex-wrap">
            <div className="card-header border-0">
              <img src={hit.pic} alt="" />
            </div>
            <Card.Body>
              <Row>
                <Col sm={4} md={4} lg={4}>
                  <div><NumberFormat value={hit.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
                </Col>
                <Col sm={4} md={4} lg={4}>
                  <div>{hit.address}</div>
                </Col>
                <Col sm={4} md={4} lg={4}>
                  <div className="description" className="float-right">
                    <FontAwesomeIcon icon={fasBed} />
                    <span>&nbsp;{hit.bedrooms}&nbsp;</span>
                    <FontAwesomeIcon icon={fasBath} />
                    <span>&nbsp;{hit.bathrooms}&nbsp;</span>
                    <FontAwesomeIcon icon={fasCar} />
                    <span>&nbsp;{hit.cars}&nbsp;</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </div>
        </li>
      )): <div></div>}
    </ul>
  </div>
)};

export const CustomAutocomplete = connectAutoComplete(Autocomplete);
