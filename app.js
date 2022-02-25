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

// API utilities

let controller;
const prioritycheck2 = (a) => {
  result =
    a.priority === "HIGH" || a.priority === "MEDIUM" || a.priority === "LOW";

  return result;
};

const statuscheck2 = (aq) => {
  results =
    aq.status === "TO DO" ||
    aq.status === "IN PROGRESS" ||
    aq.status === "DONE";
  return results;
};

const categorycheck2 = (aqk) => {
  resultsk =
    aqk.category === "WORK" ||
    aqk.category === "HOME" ||
    aqk.category === "LEARNING";
  return resultsk;
};

const camelCase = (arr) => {
  let queryObject = {
    id: arr.id,
    todo: arr.todo,
    priority: arr.priority,
    status: arr.status,
    category: arr.category,
    dueDate: arr.due_date,
  };
  return queryObject;
};

// 1) GET API

app.get("/todos/", async (request, response) => {
  const searchQuery = request.query;
  let errorMsg;
  const { status, category, priority, search_q = "" } = searchQuery;
  const priorityStatusQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    priority = "${priority}" AND status = "${status}";`;

  const categoryStatusQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    category = "${category}" AND status = "${status}";`;

  const categoryPriority = `
    SELECT
    *
    FROM
    todo
    WHERE
    category = "${category}" AND priority = "${priority}";`;
  const statusQuery = `
    SELECT
    *
    FROM
    todo 
    WHERE
    status = "${status}";`;

  const priorityQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    priority = "${priority}";`;

  const categoryQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    category = "${category}";`;

  const DBsearchQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    todo LIKE "%${search_q}%"`;

  switch (true) {
    case hasboth(searchQuery):
      if (prioritycheck2(searchQuery)) {
        if (statuscheck2(searchQuery)) {
          errorMsg = undefined;
          const PSresponse = await db.all(priorityStatusQuery);
          response.send(PSresponse.map((nums) => camelCase(nums)));
        } else {
          errorMsg = "Invalid Todo Status";
          response.status(400);
          response.send(errorMsg);
        }
      } else {
        errorMsg = "Invalid Todo Priority";
        response.status(400);
        response.send(errorMsg);
      }
      break;

    case categoryStatus(searchQuery):
      if (categorycheck2(searchQuery)) {
        if (statuscheck2(searchQuery)) {
          errorMsg = undefined;
          const SCresponse = await db.all(categoryStatusQuery);
          response.send(SCresponse.map((nums) => camelCase(nums)));
        } else {
          errorMsg = "Invalid Todo Status";
          response.status(400);
          response.send(errorMsg);
        }
      } else {
        errorMsg = "Invalid Todo Category";
        response.status(400);
        response.send(errorMsg);
      }
      break;
    case catprio(searchQuery):
      if (categorycheck2(searchQuery)) {
        if (prioritycheck2(searchQuery)) {
          errorMsg = undefined;
          const PCresponse = await db.all(categoryPriority);
          response.send(PCresponse.map((nums) => camelCase(nums)));
        } else {
          errorMsg = "Invalid Todo Priority";
          response.status(400);
          response.send(errorMsg);
        }
      } else {
        errorMsg = "Invalid Todo Category";
        response.status(400);
        response.send(errorMsg);
      }
      break;
    case onlycategory(searchQuery):
      if (categorycheck2(searchQuery)) {
        errorMsg = undefined;
        const Cresponse = await db.all(categoryQuery);
        response.send(Cresponse.map((nums) => camelCase(nums)));
      } else {
        errorMsg = "Invalid Todo Category";
        response.status(400);
        response.send(errorMsg);
      }
      break;
    case onlysearch(searchQuery):
      const searchresponse = await db.all(DBsearchQuery);
      response.send(searchresponse.map((nums) => camelCase(nums)));
      break;
    case haspriority(searchQuery):
      if (prioritycheck2(searchQuery)) {
        errorMsg = undefined;
        const Presponse = await db.all(priorityQuery);
        response.send(Presponse.map((nums) => camelCase(nums)));
      } else {
        errorMsg = "Invalid Todo Priority";
        response.status(400);
        response.send(errorMsg);
      }
      break;
    case hasstatus(searchQuery):
      if (statuscheck2(searchQuery)) {
        errorMsg = undefined;
        const Sresponse = await db.all(statusQuery);
        response.send(Sresponse.map((nums) => camelCase(nums)));
      } else {
        errorMsg = "Invalid Todo Status";
        response.status(400);
        response.send(errorMsg);
      }
      break;
    default:
      response.status(400);
      response.send("Invalid Search Query");
      break;
  }
});

//  2) GET API-2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const IDquery = `
  SELECT
  *
  FROM
  todo
  WHERE
  id = ${todoId}`;

  const IdQueryList = await db.get(IDquery);

  response.send(camelCase(IdQueryList));
});

//   3) GET API-3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  let date_new;
  let datevalidation = isValid(new Date(date));
  if (datevalidation) {
    date_new = format(new Date(date), "yyyy-MM-dd");
  }

  const dateQuery = `
    SELECT
    *
    FROM
    todo
    WHERE due_date = '${date_new}';`;

  if (datevalidation) {
    const agendaLIst = await db.all(dateQuery);

    response.send([camelCase(agendaLIst[0])]);
  } else if (datevalidation === false) {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//   4) POST API

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  let datevalidity = isValid(new Date(request.body.dueDate));

  if (dueDate !== undefined) {
    if (datevalidity) {
      request.body.dueDate = format(
        new Date(request.body.dueDate),
        "yyyy-MM-dd"
      );
    }
  }

  let barrier;
  switch (false) {
    case statuscheck2(request.body):
      barrier = "Invalid Todo Status";
      break;
    case prioritycheck2(request.body):
      barrier = "Invalid Todo Priority";
      break;
    case categorycheck2(request.body):
      barrier = "Invalid Todo Category";
      break;
    case datevalidity:
      barrier = "Invalid Due Date";
    default:
      break;
  }
  const postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status, category, due_date)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}', '${category}', '${request.body.dueDate}');`;
  if (barrier === undefined) {
    await db.run(postTodoQuery);
    response.send("Todo Successfully Added");
  } else {
    response.status(400);
    response.send(barrier);
  }
  console.log(request.body.dueDate);
});

//   5) PUT API

app.put("/todos/:todoId/", async (request, response) => {
  let { dueDate } = request.body;
  controller = undefined;
  const { todoId } = request.params;
  let updatedAttribute;
  const requestBody = request.body;

  switch (true) {
    case requestBody.status !== undefined:
      if (statuscheck2(requestBody)) {
        updatedAttribute = "Status Updated";
      } else {
        updatedAttribute = "Invalid Todo Status";
        controller = "dont run query";
      }

      break;
    case requestBody.todo !== undefined:
      updatedAttribute = "Todo Updated";

      break;
    case requestBody.priority !== undefined:
      if (prioritycheck2(requestBody)) {
        updatedAttribute = "Priority Updated";
      } else {
        updatedAttribute = "Invalid Todo Priority";
        controller = "DOnt run the query";
      }

      break;
    case requestBody.category !== undefined:
      if (categorycheck2(requestBody)) {
        updatedAttribute = "Category Updated";
      } else {
        updatedAttribute = "Invalid Todo Category";
        controller = "dont run query";
      }
      break;
    case requestBody.dueDate !== undefined:
      let datevalidation = isValid(new Date(requestBody.dueDate));
      if (datevalidation) {
        dueDate = format(new Date(requestBody.dueDate), "yyyy-MM-dd");
        updatedAttribute = "Due Date Updated";
      } else {
        updatedAttribute = "Invalid Due Date";
        controller = "Dont run the query";
      }

      break;

    default:
      updatedAttribute = "Invalid Due Date";
      controller = "Dont run the query";
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
  due_date = '${dueDate}'
WHERE
id = ${todoId}
`;
  if (controller === undefined) {
    await db.run(putQuery);
    response.send(updatedAttribute);
  } else {
    response.status(400);
    response.send(updatedAttribute);
  }
  console.log(dueDate);
  console.log(due_date);
});

//  DELETE API

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let an = "3";
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;
  if (an !== undefined) {
    await db.run(deleteTodoQuery);
    response.send("Todo Deleted");
  }
});
