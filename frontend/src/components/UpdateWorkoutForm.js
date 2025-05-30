import { useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const UpdateWorkoutForm = ({ workout, onClose }) => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [title, setTitle] = useState(workout.title);
    const [load, setLoad] = useState(workout.load);
    const [reps, setReps] = useState(workout.reps);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (!user) {
            toast.error('You must be logged in to update a workout');
            return;
        }
        
        const updatedWorkout = { title, load, reps };
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/workouts/` + workout._id, {
                method: 'PATCH',
                body: JSON.stringify(updatedWorkout),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            const json = await response.json();
            
            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.emptyFields || []);
                toast.error(json.error || 'Failed to update workout');
            }
            
            if (response.ok) {
                setError(null);
                setEmptyFields([]);
                // Create a new workout object with all the original properties plus updates
                const updatedWorkoutData = {
                    ...workout,
                    ...json,
                    title,
                    load,
                    reps
                };
                dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkoutData });
                toast.success('Workout updated successfully!');
                onClose();
            }
        } catch (error) {
            setError('An error occurred while updating the workout');
            toast.error('An error occurred while updating the workout');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="update-form" onSubmit={handleSubmit}>
            <h3>Update Workout</h3>

            <label>Exercise Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
                disabled={isLoading}
            />
            
            <label>Load (in Kg):</label>
            <input
                type="number"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
                disabled={isLoading}
            />
            
            <label>Reps:</label>
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
                disabled={isLoading}
            />
            
            <button disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Workout'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default UpdateWorkoutForm; 