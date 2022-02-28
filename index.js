import {object, when} from "testdouble"


const o = object()

when(o.test()).thenReturn("blah")