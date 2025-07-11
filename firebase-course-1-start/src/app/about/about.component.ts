import { Component, OnInit } from '@angular/core';


import 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/firestore';
import { COURSES, findLessonsForCourse } from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    onReadDoc() {
        this.db.doc('/courses/61ASoZMONtRZLipBdaHD').get().subscribe(snap => {
            console.log(snap.id);
            console.log(snap.data())
        });
    }

    onReadDocChanges() {
        this.db.doc('courses/61ASoZMONtRZLipBdaHD')
            .snapshotChanges()
            .subscribe(snap => {
                console.log(snap.payload.id);
                console.log(snap.payload.data())
            })
    }
    
    onReadDocValueChanges() {
        this.db.doc('/courses/61ASoZMONtRZLipBdaHD')
        .valueChanges()
        .subscribe(snap => {
            console.log(snap)
        })
    }

    onReadCollection() {
        this.db
            .collection('/courses/61ASoZMONtRZLipBdaHD/lessons', ref => ref.where('seqNo', '<=', 10).orderBy('seqNo'))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id)
                    console.log(snap.data())
                })
            })
    }

    onReadCollectionFilteredByMoreThanOneParameter() {
        this.db
            .collection('courses', ref => ref
                .where('seqNo', '<=', 10)
                .where('url', '==', "angular-forms-course")
                .orderBy('seqNo'))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id)
                    console.log(snap.data())
                })
            })
    }

    onReadCollectionGroup() {
        this.db.collectionGroup('lessons', ref => ref.where('seqNo', '==', 1))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id)
                    console.log(snap.data())
                })
            })
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = { ...data };
        delete newData.id;
        return newData;
    }


}
















