import React, {useState, useEffect} from 'react';
import axiosInstance from '../axiosConfig';
import AddFilterModal from './AddFilterModal';

const Filters = () => {
    const [filters, setFilters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInlineOpen, setIsInlineOpen] = useState(false);

    useEffect(() => {
        fetchFilters();
    }, []);

    const fetchFilters = () => {
        axiosInstance.get('/filters/findAllFilters')
            .then(response => setFilters(response.data))
            .catch(error => console.error('There was an error fetching the filters!', error));
    };

    const closeModal = (shouldRefresh = false, shouldCloseInline = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) {
            fetchFilters();
        }
        if (shouldCloseInline) {
            setIsInlineOpen(false);
        }
    };

    return (
        <div className="container">
            <h1>Test assignment “Filters”</h1>
            <button className="button" onClick={() => setIsModalOpen(true)}>Add Filter In Modal</button>
            <button className="button" onClick={() => setIsInlineOpen(!isInlineOpen)}>
                {isInlineOpen ? 'Close Inline Modal' : 'Add Filter Inline'}
            </button>

            <AddFilterModal isOpen={isModalOpen} onClose={closeModal} isModal={true}/>
            {isInlineOpen && <AddFilterModal isOpen={true} onClose={() => closeModal(true, true)} isModal={false}/>}
            <table className="table">
                <thead>
                <tr>
                    <th>Filter Name and Criteria:</th>
                    <th>Date added</th>
                </tr>
                </thead>
                <tbody>
                {filters.map(filter => (
                    <React.Fragment key={filter.id}>
                        <tr>
                            <td className="card-header">{filter.name}</td>
                            <td>{new Date(filter.createdDtime).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <div className="card">
                                    <div className="card-header">Criteria</div>
                                    {filter.criteria.map(criteria => (
                                        <div className="card-content" key={criteria.id}>
                                            <span>Type:</span> {criteria.type} <br/>
                                            <span>Condition:</span> {criteria.condition} <br/>
                                            <span>Value:</span> {criteria.type === 'Amount'
                                            ? criteria.valueAmount
                                            : criteria.type === 'Date' ? criteria.valueDate : criteria.valueTitle}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Filters;