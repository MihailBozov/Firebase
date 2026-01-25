import * as functions from "firebase-functions";

export const onAddCourseUpdatePromoCounter =
  functions.runWith({
    timeoutSeconds: 300,
    memory: "128MB"
  })
    .firestore.document("courses/{courseId}")
    .onCreate(async (snap, context) => {
      await (await import("./promotions-counter/on-add-course")).default(snap, context)
    });

export const onCourseUpdatedUpdatePromoCounter =
  functions.firestore
    .document('courses/{courseId}')
    .onUpdate(async (change, context) => {
      await (await import('./promotions-counter/on-course-updated')).default(change, context);
    });

export const onCourseDeleteUpdatePromoCounter =
  functions.firestore
  .document('courses/{courseId}')
  .onDelete(async (snap, context) => {
    (await import('./promotions-counter/on-delete-course')).default(snap, context);
  });

