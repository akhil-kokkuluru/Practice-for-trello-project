const express = require("express");

const path = require("path");

const sqlite3 = require("sqlite3");

const { open } = require("sqlite");

const app = express();

app.use(express.json());

const DBpath = path.join(__dirname, "todoApplication.db");

let db = null;

const { format, isValid } = require("date-fns");

const serverInitialization = async () => {
  try {
    db = await open({ filename: DBpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server is UP and running successfully at port:3000");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

serverInitialization();

module.exports = app;

// QUERY CHECKING UTILITIES

const hasstatus = (arg) => {
  let ag =
    arg.search_q === undefined &&
    arg.priority === undefined &&
    arg.category === undefined;
  if (ag) {
    if (arg.status !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    false;
  }
};

const haspriority = (arr) => {
  let gh =
    arr.status === undefined &&
    arr.search_q === undefined &&
    arr.category === undefined;
  if (gh) {
    if (arr.priority !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const hasboth = (argu) => {
  let aa = argu.search_q === undefined && argu.category === undefined;
  if (aa) {
    if (argu.priority !== undefined && argu.status !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const onlysearch = (abc) => {
  let arr =
    abc.status === undefined &&
    abc.priority === undefined &&
    abc.category === undefined;
  if (arr) {
    if (abc.search_q !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const categoryStatus = (abcd) => {
  let qw = abcd.priority === undefined && abcd.search_q === undefined;
  if (qw) {
    if (abcd.category !== undefined && abcd.status !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const onlycategory = (afc) => {
  let arr =
    afc.status === undefined &&
    afc.priority === undefined &&
    afc.search_q === undefined;
  if (arr) {
    if (afc.category !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const catprio = (argus) => {
  let aa = argus.search_q === undefined && argus.status === undefined;
  if (aa) {
    if (argus.priority !== undefined && argus.category !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const prioritycheck = (a) => {
  result =
    a.priority === "HIGH" || a.priority === "MEDIUM" || a.priority === "LOW";
  if (result === false) {
    statement = "Invalid Todo Priority";
  }
  return result;
};

const statuscheck = (aq) => {
  results =
    aq.status === "TO DO" ||
    aq.status === "IN PROGRESS" ||
    aq.status === "DONE";
  return results;
};

const categorycheck = (aqk) => {
  resultsk =
    aqk.category === "WORK" ||
    aqk.category === "HOME" ||
    aqk.category === "LEARNING";
  if (resultsk === false) {
    statement = "Invalid Todo Category";
  }
  return resultsk;
};

// 1) GET API

app.get("/todos/", async (request, response) => {
  let statement = undefined;
  let data = null;
  let finalQuery;
  const { status, priority, search_q, category } = request.query;
  switch (true) {
    case hasstatus(request.query):
      sd =
        request.query.status === "TO DO" ||
        request.query.status === "IN PROGRESS" ||
        request.query.status === "DONE";
      if (sd === false) {
        statement = "Invalid Todo Status";
      }
      if (sd) {
        statement = undefined;
        finalQuery = `
                SELECT
                *
                FROM
                todo
                WHERE status = '${status}';`;
      }
      break;
    case haspriority(request.query):
      let k = prioritycheck(request.query);
      if (k) {
        statement = undefined;
      } else if (k === false) {
        statement = "Invalid Todo Priority";
      }
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE priority = '${priority}';`;
      break;
    case hasboth(request.query):
      let hk = prioritycheck(request.query);
      if (hk) {
        statement = undefined;
      } else {
        statement = "Invalid Todo Priority";
      }
      let kh = statuscheck(request.query);
      if (kh === true && hk === false) {
        statement = "Invalid Todo Priority";
      } else if (kh !== true && hk !== false) {
        statement = "Invalid Todo Status";
      }
      finalQuery = `SELECT
        *
        FROM
        todo
        WHERE status = '${status}' AND priority = '${priority}';`;
      break;
    case onlysearch(request.query):
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        todo LIKE '%${search_q}%';`;
      break;
    case categoryStatus(request.query):
      let ctc = categorycheck(request.query);
      let sc = statuscheck(request.query);
      if (ctc && sc) {
        statement = undefined;
      } else if (ctc === false && sc === true) {
        statement = "Invalid Todo Category";
      } else if (ctc === true && sc === false) {
        statement = "Invalid Todo Status";
      }
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        category = '${category}' and status = '${status}';`;
      break;
    case onlycategory(request.query):
      let g = categorycheck(request.query);
      if (g) {
        statement = undefined;
      } else {
        statement = "Invalid Todo Category";
      }
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        category = '${category}';`;
      break;
    case catprio(request.query):
      let Actc = categorycheck(request.query);
      let Asc = prioritycheck(request.query);
      if (Actc && Asc) {
        statement = undefined;
      } else if (Actc === false && Asc === true) {
        statement = "Invalid Todo Category";
      } else if (Actc === true && Asc === false) {
        statement = "Invalid Todo Priority";
      }

      categorycheck(request.query);
      prioritycheck(request.query);
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        category = '${category}' and priority = '${priority}';`;
      break;
    default:
      finalQuery = `
        SELECT
        *
        FROM
        todo;`;
      break;
  }
  if (statement === undefined) {
    data = await db.all(finalQuery);
    response.send(data);
  } else if (statement !== undefined) {
    response.status(400);
    response.send(`${statement}`);
  }
});

//  2) GET API-2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todoLi = await db.get(getTodoQuery);
  response.send(todoLi);
});

//   3) GET API-3
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  let valida = isValid(new Date(date));
  let datetodo;
  if (valida) {
    let dates = format(new Date(date), "yyyy-MM-dd");
    const agendaQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    due_date = '${dates}';`;
    datetodo = await db.get(agendaQuery);
    response.send(datetodo);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//   4) POST API

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status, category, due_date)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}', '${category}', '${dueDate}');`;
  await db.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

//   5) API- 6

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updatedAttribute;
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updatedAttribute = "Status";
      break;
    case requestBody.todo !== undefined:
      updatedAttribute = "Todo";
      break;
    case requestBody.priority !== undefined:
      updatedAttribute = "Priority";
      break;
    case requestBody.category !== undefined:
      updatedAttribute = "Category";
      break;
    case requestBody.due_date !== undefined:
      updatedAttribute = "Due Date";
      break;

    default:
      updatedAttribute = "No updation given";
      break;
  }

  const previousQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    id = ${todoId};`;
  const previousValues = await db.get(previousQuery);
  const {
    todo = previousValues.todo,
    priority = previousValues.priority,
    status = previousValues.status,
    category = previousValues.category,
    due_date = previousValues.due_date,
  } = requestBody;

  const putQuery = `
UPDATE todo
SET
  todo = '${todo}',
  priority = '${priority}',
  status = '${status}',
  category = '${category}',
  due_date = '${due_date}'
WHERE
id = ${todoId}
`;
  await db.run(putQuery);
  response.send(`${updatedAttribute} Updated`);
});
