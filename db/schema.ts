import * as auth from "./schema/auth";
import * as capsule from "./schema/capsule";
import * as upload from "./schema/upload";
import * as letter from "./schema/letter";
import * as addressee from "./schema/addressee";
import * as order from "./schema/order";
import * as obligation from "./schema/obligation";
import * as intent from "./schema/intent";
import * as ledger from "./schema/ledger";
import * as purchase from "./schema/purchase";
import * as plan from "./schema/package";
import * as view from "./schema/view";
import * as newsletter from "./schema/newsletter";
import * as demo from "./schema/demo";

const schema = {
  ...auth,
  ...upload,
  ...letter,
  ...capsule,
  ...addressee,
  ...order,
  ...obligation,
  ...intent,
  ...ledger,
  ...plan,
  ...purchase,
  ...view,
  ...newsletter,
  ...demo,
};

export default schema;
