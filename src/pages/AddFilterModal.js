import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import axiosInstance from '../axiosConfig';

Modal.setAppElement('#root');

const AddFilterModal = ({isOpen, onClose, isModal = true}) => {
    const [name, setName] = useState('');
    const [criteriaList, setCriteriaList] = useState([
        {type: 'Amount', condition: 'Greater than', value: ''}
    ]);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setCriteriaList([{type: 'Amount', condition: 'Greater than', value: ''}]);
        setShowError(false);
    };

    const getDefaultConditionForType = (type) => {
        switch (type) {
            case 'Amount':
                return 'Greater than';
            case 'Title':
                return 'Starts with';
            case 'Date':
                return 'Before';
            default:
                return '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const hasFilledCriteria = criteriaList.some(criteria => criteria.value !== '');
        if (!hasFilledCriteria) {
            setShowError(true);
            return;
        }

        const preparedCriteria = criteriaList.map(criteria => {
            const valueKey = `value${criteria.type === 'Amount' ? 'Amount' : criteria.type}`;
            return {...criteria, [valueKey]: criteria.value};
        });

        axiosInstance.post('/filters/insertFilter', {name, criteria: preparedCriteria})
            .then(() => {
                onClose(true);
                resetForm();
            })
            .catch(error => console.error('There was an error adding the filter!', error));
    };

    const renderCriteria = (criteria, id) => {
        const {type, condition, value} = criteria;
        return (
            <div key={id} className="criteria-row">
                <label>Criteria:</label>
                <select
                    value={type}
                    onChange={(e) => setCriteriaList(criteriaList.map((c, index) => index === id ?
                        {...c, type: e.target.value, condition: getDefaultConditionForType(e.target.value)} : c))}
                    className="criteria-select"
                >
                    <option value="Amount">Amount</option>
                    <option value="Title">Title</option>
                    <option value="Date">Date</option>
                </select>
                <select
                    value={condition}
                    onChange={(e) => setCriteriaList(criteriaList.map((c, index) => index === id ? {...c, condition: e.target.value} : c))}
                    className="criteria-select"
                >
                    {type === 'Amount' && <>
                        <option value="Greater than">Greater than</option>
                        <option value="Less than">Less than</option>
                        <option value="Equal to">Equal to</option>
                    </>}
                    {type === 'Title' && <>
                        <option value="Starts with">Starts with</option>
                        <option value="Ends with">Ends with</option>
                        <option value="Contains">Contains</option>
                    </>}
                    {type === 'Date' && <>
                        <option value="Before">Before</option>
                        <option value="After">After</option>
                        <option value="On">On</option>
                    </>}
                </select>
                <input
                    type={type === 'Amount' ? 'number' : (type === 'Date' ? 'date' : 'text')}
                    value={value}
                    onChange={(e) => setCriteriaList(criteriaList.map((c, index) => index === id ? {...c, value: e.target.value} : c))}
                    className="criteria-input"
                />
                <button type="button" className="remove-criteria-button"
                        onClick={() => setCriteriaList(criteriaList.filter((c, index) => index !== id))}>-
                </button>
            </div>
        );
    };

    const modalContent = (
        <div className="modal-content">
            <div className="modal-header">
                <h2>Add Filter</h2>
                <button onClick={() => onClose(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                </label>
                {criteriaList.map((criteria, id) => renderCriteria(criteria, id))}
                <button type="button" className="add-criteria-button"
                        onClick={() => setCriteriaList([...criteriaList, {type: 'Amount', condition: 'Greater than', value: ''}])}>+ ADD ROW
                </button>
                {showError && <div className="error-message">Please add at least one criterion.</div>}
                <div className="form-buttons">
                    <button type="submit">Add</button>
                    <button type="button" className="cancel-button" onClick={() => onClose(false)}>Close</button>
                </div>
            </form>
        </div>
    );

    return (
        isModal ? (
            <Modal
                isOpen={isOpen}
                onRequestClose={() => onClose(false)}
                contentLabel="Add Filter"
                className="modal-container"
            >
                {modalContent}
            </Modal>
        ) : (
            <div className="modal-container">
                {modalContent}
            </div>
        )
    );
};

export default AddFilterModal;
