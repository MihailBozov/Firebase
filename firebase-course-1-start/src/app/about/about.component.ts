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

    onReadDock() {
        this.db.doc('/courses/owWPPZ0Ck2R5oiDpZcLW')
            .get()
            .subscribe(snap => {
                console.log(snap.id)
                console.log(snap.data())

            })
    }

    onReadCollection() {
        this.db.collection('/courses/6wilHO1zONo7YUoQpFoV/lessons')
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            })
    }

    onReadCollectionFiltered() {
        this.db.collection('/courses/6wilHO1zONo7YUoQpFoV/lessons', ref => ref.where('seqNo', '==', 1))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            })
    }

    onReadCollectionFilteredWithOrder() {
        this.db.collection('/courses/6wilHO1zONo7YUoQpFoV/lessons', ref => ref.where('seqNo', '<=', 3).orderBy('seqNo'))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            })
    }

    onReadCollectionFilteredByMoreFields() {
        this.db.collection('courses', ref => ref
            .where('price', '<=', 50)
            .where('url', '==', 'angular-forms-course'))
            .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            })
    }
    
        onReadCollectionGroup() {
        this.db.collectionGroup('lessons', ref => ref
            .where('seqNo', '<=', 20)
        )
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
















