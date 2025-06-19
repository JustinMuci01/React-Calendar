import React, {useState, useEffect} from "react";

function Menu(props){
    
    const[tasks, setTasks] = useState([
        {
            name: "game",
            isPinned: false
        }, 
        {
            name: "youtube",
            isPinned: false
        }
        ]);
    const[newTask, setNewTask] = useState({name:"", isPinned:false}); 
    const[removedTasks, setRemovedTask] = useState([]); 
    const curr = new Date();
    const[currentDate, setCurrentDate] = useState(new Date());

    function incDateChange(currentDate)
    {
        let day = new Date(currentDate);
        day.setDate(currentDate.getDate() + 1);
        setCurrentDate(day);
    }
    function decDateChange(currentDate)
    {
        if (currentDate >= curr)
        {
        let day = new Date(currentDate);
        day.setDate(currentDate.getDate() - 1);
        setCurrentDate(day);
        }
    }

    function handleInputChange(e){
        setNewTask(newTask => ({
            ...newTask,
            name:e.target.value
        }));
    }

    function addTask(){
        if (newTask.name.trim !== "")
        {
        setTasks(t => [...t, newTask]); //take old tasks array and add newTask to the end
        setNewTask("");
        }
    }

    function moveTaskUp(index){
        if (index >0)
        {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index-1]] = [updatedTasks[index-1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index){
        if (index < tasks.length-1 && !tasks[index].isPinned)
        {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index+1]] = [updatedTasks[index+1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function pinToTop(index){
        let deleted = tasks.filter((element, i) => i!==index);
        let updatedTasks = [{...tasks[index], isPinned:true}, ...deleted];
        setTasks(updatedTasks);
    }
    
    function removeTask(index){
        setRemovedTask([tasks[index]]);
        const updatedTasks = tasks.filter((element, i) => i!==index);
        setTasks(updatedTasks);
    }

    function bringBack(removedTask){
        setTasks (t => [...t, removedTask]);
        setRemovedTask([]);
    }

    return(
        <>
        <div className="ToDo-list">
        <h1><button className = "changeDate" onClick= {() =>decDateChange(currentDate)}>&larr;</button>
        {currentDate.toLocaleDateString()} 
        <button className = "changeDate" onClick= {() => incDateChange(currentDate)}>&rarr;</button></h1>
        {/* We use an arrow function here to say on click run the function, without it the function would
        be ran upon rendering and the return value would be returned on click.
        This is called a wrapper function */}

        <div>
        <input type="text" onChange = {handleInputChange} placeholder="Enter new task..."/> 
        <input type="date" />
        <button onClick = {addTask}>ADD</button>
        </div>

        <ol>
            {tasks.map((task, index) => 
                <li className={`${task.isPinned ? 'pinned' : ''}`} key={index}>
                    <span className="text">{task.name}</span>
                    <div className = "button-list">
                    <button className="" onClick={() => removeTask(index)}>Delete</button>
                    <button className="" onClick={() => moveTaskDown(index)}>v</button>
                    <button className="" onClick={() => moveTaskUp(index)}>^</button>
                    <button className="" onClick={() => pinToTop(index)}>Pin</button>  
                    </div>

                </li>
            )}
            {removedTasks.map((task, index) =>
            <li key = {-1} className = "trash-bin">
                <span className="text">{task.name}</span>
                <button onClick={() => bringBack(task)}>Add Back</button>  
            </li>
            )}
        </ol>
        </div>
        </>
    );
}

export default Menu;