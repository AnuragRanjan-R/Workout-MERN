import { useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!user) return;

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/workouts`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_WORKOUTS', payload: json });
            }
        }
        fetchWorkouts();
    }, [dispatch, user]);

    return (
        <div className="home">
            <div className="workouts">   
                {workouts && workouts.map((workout) => (
                    <WorkoutDetails key={workout._id} workout={workout}/>
                ))}
            </div>
            <WorkoutForm />
        </div>
    );
}

export default Home;