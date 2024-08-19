import propTypes from "prop-types";

const Filter = ({
  filterName,
  filterId,
  filterLabel,
  filterValue,
  filterFunction,
  children,
}) => {

    
  return (
    <>
      <li>
        <label htmlFor={filterName}>{filterLabel}</label>
        <div>
          <select
            name={filterName}
            id={filterId}
            value={filterValue ? filterValue : ""}
            onChange={(e) => filterFunction(e.target.value)}
          >
            {children}
          </select>
        </div>
      </li>
    </>
  );
};

Filter.propTypes = {
  filterName: propTypes.string.isRequired,
  filterId: propTypes.string.isRequired,
  filterFunction: propTypes.func.isRequired,
  filterValue: propTypes.string.isRequired,
  filterLabel: propTypes.string.isRequired,
  children: propTypes.element.isRequired,
};

export default Filter;
