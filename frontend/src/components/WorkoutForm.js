import { useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from 'react-toastify';

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to add a workout');
            return;
        }

        const workout = { title, load, reps };
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/workouts`, {
            method: 'POST',
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
            toast.error(json.error);
        } if (response.ok) {
            setTitle('');
            setLoad('');    
            setReps('');
            setError(null);
            setEmptyFields([]);
            console.log('New workout added:', json);
            dispatch({ type: 'CREATE_WORKOUT', payload: json });
            toast.success('New workout added successfully!');
        }
    }



    return (
        <form className="create" onSubmit={handleSubmit} style={{ color: 'white' }}>
            <h3> Add a new Workout</h3>

            <label>Exercise Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Load (in Kg):</label>
            <input
                type="number"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />
            <label>Reps:</label>
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />
            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm;