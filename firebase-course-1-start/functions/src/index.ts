import * as functions from "firebase-functions";
import { db } from "./init";
import { FieldValue } from "firebase-admin/firestore";

export const onAddCourseUpdatePromoCounter =
  functions.runWith({
    timeoutSeconds: 300,
    memory: "128MB"
  })
    .firestore.document("courses/{courseId}")
    .onCreate(async (snap, context) => {
      functions.logger.debug(`Running add course trigger for courseId ${context.params.courseId}`);

      const course = snap.data();
      if (course.promo) {
        return db.doc("courses/stats").update({
          totalPromo: FieldValue.increment(1)
        })
      }
    });