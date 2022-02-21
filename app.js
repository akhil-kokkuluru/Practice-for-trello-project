const express = require("express");

const path = require("path");

const sqlite3 = require("sqlite3");

const { open } = require("sqlite");

const app = express();

app.use(express.json());

const DBpath = path.join(__dirname, "todoApplication.db");

let db = null;

const { format } = require("date-fns");

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

// ////////////////////////////

const hasstatus = (arg) => {
  let ag =
    arg.search_q === undefined &&
    arg.priority === undefined &&
    arg.category === undefined;
  if (ag) {
    if (arg.status !== undefined) {
      if (arg.status !== "TO DO" || "IN PROGRESS" || "DONE") {
        return true;
      }
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

app.get("/todos/", async (request, response) => {
  let statement = undefined;
  let data = null;
  let finalQuery;
  const { status, priority, search_q, category } = request.query;
  switch (true) {
    case hasstatus(request.query):
      if (request.query.status === "TO DO" || "IN PROGRESS" || "DONE") {
        statement = undefined;
        finalQuery = `
                SELECT
                *
                FROM
                todo
                WHERE status = '${status}';`;
      }
      if (request.query.status !== "TO DO" || "IN PROGRESS" || "DONE") {
        statement = "invlaid TODO";
      }
      break;
    case haspriority(request.query):
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE priority = '${priority}';`;
      break;
    case hasboth(request.query):
      finalQuery = `SELECT
        *
        FROM
        todo
        WHERE status = '${status}' and priority = '${priority};`;
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
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        category = '${category}' and status = '${status}';`;
      break;
    case onlycategory(request.query):
      finalQuery = `
        SELECT
        *
        FROM
        todo
        WHERE
        category = '${category}';`;
      break;
    case catprio(request.query):
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

  if (statement === null) {
    data = await db.all(finalQuery);
    response.send(data);
  } else {
    response.status(400);
    response.send(statement);
    console.log(statement);
  }
});
