import React, {useState, useEffect} from "react";
import dayjs from "dayjs";

function Menu(props){   
    
    const curr = dayjs();
    const[currentDate, setCurrentDate] = useState(curr);
    const[nextDay, setNextDay] = useState(currentDate.add(1, 'day'));
    const[prevDay, setPrevDay] = useState(currentDate.subtract(1, 'day'));
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : {
            [curr.format("MM-DD-YYYY")]: [
                { name: "game", isPinned: false },
                { name: "youtube", isPinned: false }
            ]   
        };
    });

    useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const[newTask, setNewTask] = useState({name:"", isPinned:false}); 
    const[removedTask, setRemovedTask] = useState(null); 

    function incDateChange()
    {
        let newPrev = currentDate;
        setPrevDay(newPrev);
        setCurrentDate(nextDay);
        let modifiedDate = nextDay.add(1, 'day');
        setNextDay(modifiedDate);
    }
    function decDateChange()
    {
        setNextDay(currentDate);
        setCurrentDate(prevDay);
        let modifiedDate = prevDay.subtract(1, 'day');
        setPrevDay(modifiedDate);
    }

    function handleInputChange(e){
        setNewTask(newTask => ({
            ...newTask,
            name:e.target.value
        }));
    }

    function addTask() {
    if (newTask.name.trim() !== "") {
        const key = currentDate.format("MM-DD-YYYY");

        setTasks(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), newTask]
        }));

        setNewTask({ name: "", isPinned: false });
    }
    }


    function moveTaskUp(index){
        const key = currentDate.format("MM-DD-YYYY");
        const currentTasks = tasks[key];
        if (index >0 )
        {
            const updatedTasks = [...currentTasks];
            [updatedTasks[index], updatedTasks[index-1]] = [updatedTasks[index-1], updatedTasks[index]];
        setTasks(prev => ({
        ...prev,    
        [key]: updatedTasks
        }));
        }
    }

    function moveTaskDown(index){
        const key = currentDate.format("MM-DD-YYYY");
        const currentTasks = tasks[key];
        if (index < currentTasks.length-1 && !currentTasks[index].isPinned)
        {
            const updatedTasks = [...currentTasks];
            [updatedTasks[index], updatedTasks[index+1]] = [updatedTasks[index+1], updatedTasks[index]];
        setTasks(prev => ({
        ...prev,    
        [key]: updatedTasks
        }));
        }
    }

    function pinToTop(index){
        const key = currentDate.format("MM-DD-YYYY");
        const currentTasks = tasks[key];

        const newRemoved = {...currentTasks[index], isPinned:true};

        const updatedTasks = currentTasks.filter((element, i) => i!==index);

        const newTasks = [newRemoved, ...updatedTasks]
        setTasks(prev => ({
        ...prev,
        [key]: newTasks
        }));
    }
    
    function removeTask(index){
        const currentTasks = tasks[currentDate.format("MM-DD-YYYY")];
        if (currentTasks[index])
        {
        setRemovedTask({...currentTasks[index], date: currentDate.format("MM-DD-YYYY")});
        }
        const updatedTasks = currentTasks.filter((element, i) => i!==index);

        setTasks(prev => ({
        ...prev,
        [currentDate.format("MM-DD-YYYY")]: updatedTasks
        }));

        console.log(removedTask);
    }

    function bringBack(){
        const key = currentDate.format("MM-DD-YYYY");

        const broughtBackTask = {...removedTask, isPinned:false};
        setTasks(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), broughtBackTask]
        }));

        setRemovedTask();
    }

    return(
        <>
        <div className="ToDo-list">
        <div className = "date-bar">
        <button className = "changeDate" onClick= {() =>decDateChange()}>&larr;</button>
        <h1>
        {currentDate.format("dddd: MM-DD-YYYY")} 
        </h1>
        <button className = "changeDate" onClick= {() => incDateChange()}>&rarr;</button>
        </div>
        {/* We use an arrow function here to say on click run the function, without it the function would
        be ran upon rendering and the return value would be returned on click.
        This is called a wrapper function */}

        <div className = "searchBar">
        <h2 className = "other-day">{prevDay.format("MM-DD")}</h2>
        <div className = "search-button-container">
        <input type="text" onChange = {handleInputChange} placeholder="Enter new task..."/> 
        <button onClick = {addTask}>ADD</button>
        </div>
        <h2 className = "other-day">{nextDay.format("MM-DD")}</h2>
        </div>

        <div className = "day-set">
        <div className = "previous-day">
                <ol>
            {(tasks[prevDay.format("MM-DD-YYYY")] || []).length === 0 ? (
                <div className = "change-list" onClick = {() => decDateChange()}><li className="no-tasks">No tasks</li></div>
            ) : (
            (tasks[prevDay.format("MM-DD-YYYY")] || []).map((task, index) => (
                 <div className = "change-list" onClick = {() => decDateChange()}><li className={`${task.isPinned ? 'pinned-other' : 'other-list'}`} key={index}>
                    <span className="text">{task.name}</span>
                </li>
                </div>
            ))
        )}  
        </ol>

        </div>
        <div className = "curr-day">
                <ol>
            {(tasks[currentDate.format("MM-DD-YYYY")] || []).length === 0 ? (
                <li className="no-tasks">No tasks</li>
            ) : (
            (tasks[currentDate.format("MM-DD-YYYY")] || []).map((task, index) => (
                <li className={`${task.isPinned ? 'pinned' : ''}`} key={index}>
                    <span className="text">{task.name}</span>
                    <div className = "button-list">
                    <button className="" onClick={() => removeTask(index)}>Delete</button>
                    <button className="" onClick={() => moveTaskDown(index)}>v</button>
                    <button className="" onClick={() => moveTaskUp(index)}>^</button>
                    <button className="" onClick={() => pinToTop(index)}>Pin</button>  
                    </div>

                </li>
            )
        ))}  
        {removedTask && removedTask.date === currentDate.format("MM-DD-YYYY") && (
            <div className="trash-bin">
                <span className="text">{removedTask.name}</span>
                <button onClick={bringBack}>Add Back</button>
            </div>
        )}
        </ol>
        </div>
        <div className = "next-day">
                <ol>
            {(tasks[nextDay.format("MM-DD-YYYY")] || []).length === 0 ? (
                <div className = "change-list" onClick = {() => incDateChange()}><li className="no-tasks">No tasks</li> </div>
            ) : (
            (tasks[nextDay.format("MM-DD-YYYY")] || []).map((task, index) => (
            <div className = "change-list" onClick = {() => incDateChange()}>  
            <li className={`${task.isPinned ? 'pinned-other' : 'other-list'}`} key={index}>
                    <span className="text">{task.name}</span>

            </li>
            </div>
            ))
        )}  
        </ol>
        </div>
        </div>
        </div>
        </>
    );
}

export default Menu;