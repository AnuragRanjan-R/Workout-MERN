import { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import UpdateWorkoutForm from './UpdateWorkoutForm';
import { toast } from 'react-toastify';

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState(workout);

    useEffect(() => {
        setCurrentWorkout(workout);
    }, [workout]);

    const handleClick = async () => {
        if (!user) {
            toast.error('You must be logged in to delete a workout');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/workouts/` + workout._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: 'DELETE_WORKOUT', payload: json });
            toast.success('Workout deleted successfully!');
        } else {
            toast.error(json.error || 'Failed to delete workout');
        }
    }

    return (
        <div className="workout-details">
            {!showUpdateForm ? (
                <>
                    <h4>{currentWorkout.title}</h4>
                    <p><strong>Load (kg): </strong>{currentWorkout.load}</p>
                    <p><strong>Reps: </strong>{currentWorkout.reps}</p>
                    <p>{formatDistanceToNow(new Date(currentWorkout.createdAt), {addSuffix: true})}</p>
                    <div className="workout-actions">
                        <span className="material-symbols-outlined edit" onClick={() => setShowUpdateForm(true)}>.</span>
                        <span className="material-symbols-outlined delete" onClick={handleClick}>delete</span>
                    </div>
                </>
            ) : (
                <UpdateWorkoutForm 
                    workout={currentWorkout} 
                    onClose={() => setShowUpdateForm(false)} 
                />
            )}
        </div>
    )
}

export default WorkoutDetails;