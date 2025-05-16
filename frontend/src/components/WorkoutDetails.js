import { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import UpdateWorkoutForm from './UpdateWorkoutForm';

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState(workout);

    useEffect(() => {
        setCurrentWorkout(workout);
    }, [workout]);

    const handleClick = async () => {
        const response = await fetch('/api/workouts/' + workout._id, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: 'DELETE_WORKOUT', payload: json });
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