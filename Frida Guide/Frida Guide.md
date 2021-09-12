
# Write Frida  Hook For Android 

## What Frida
Frida is a dynamic code instrumentation toolkit. It lets you inject your script into black-box processes.

## Prerequisite
```txt
1-  understand Javascript (js)
2- understand  Java OOP
3- rooted android device(emulator)
```

before we going to write hooks ,we begin with datatype that are use in js as explain in below table.


##  datatype
|-|-|
|-|-|
|byte|Byte-length integer|
|short|Short integer|
|int|Integer|
|long|Long integer|
|float|Single-precision floating point|
|double|Double-precision floating point|
|char|A single character|
|boolean| A Boolean value (true or false)|



in order to explain how hooks write i use apk application written for this purpose.


### application code
below you can find decompile apk open using jd-gui   extracted after reverse engineering application. 

![alt text](https://github.com/cyberheartmi9/Frida-Guide/blob/main/Frida%20Guide/screenshots/Pasted%20image%2020210909195702.png)

in order to write hook you must understand what you will be need for this we explain it by number in above image.


```text
1- application packages 
2-  Class File (BasicType) 
3-  package  name for BasicType
4- Class Body
```

Prerequisite for write hook is class package name (com.blog.testfrida.examples)  [dot ] class name (BasicTypes).

```java
com.blog.testfrida.examples.BasicTypes
```


### Frida JS api

in order to hook application you must understand frida api

|api name|description|
|-|-|
|Java.use(className)|It dynamically get a JavaScript wrapper for className. Wrapper is basically a function that is intended to call one or more other functions.|
|Java.perform|ensure that the current thread is attached to the VM and call fn|


className: com.blog.testfrida.examples.BasicTypes

example 

```js
Java.perform(function(){

var c= Java.use("com.blog.testfrida.examples.BasicTypes");

}
```

	
next will be explore every data type and how to write hooks for theme in application we have function for every data type.

### int data type


```java
public static byte addTwoBytes(byte paramByte1, byte paramByte2) {  
 return (byte)(paramByte1 + paramByte2);  
 }  
   
 public static int addTwoInts(int paramInt1, int paramInt2) {  
 return paramInt1 + paramInt2;  
 }  
   
 public static long addTwoLongs(long paramLong1, long paramLong2) {  
 return paramLong1 + paramLong2;  
 }  
   
 public static short addTwoShorts(short paramShort1, short paramShort2) {  
 return (short)(paramShort1 + paramShort2);  
 }
```

hook for above function  will be defined as we explain early , type it's javascript wrapper for BasicType class by using Java.use as binder.

calling function through frida will be as below by using wrapper to access class method and other data-type defined in class.

```js

Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

console.log("addint : [ "+type.addTwoInts(1,2)+" ]"); 
console.log("addbytes : [ "+type.addTwoBytes(12,2)+" ]"); 
console.log("addTwoLongs : [ "+type.addTwoLongs(199393,2)+" ]"); 


});

```


```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
addint : [ 3 ]
addbytes : [ 14 ]
addTwoLongs : [ 199395 ]
[Google::PID::1688]->

```




## Boolean type

for Boolean Data type  we have  negate function which reverse boolean from T  --> F and from F --> T 



```java
  
 public static boolean negate(boolean paramBoolean) {  
 return paramBoolean ^ true;  
 }
```




```js
Java.perform(function(){

var boolean= Java.use("com.blog.testfrida.examples.BasicTypes"); 

  console.log(boolean.negate(false));
  console.log(boolean.negate(true));

});
```


![alt text](https://github.com/cyberheartmi9/Frida-Guide/blob/main/Frida%20Guide/screenshots/Pasted%20image%2020210909201935.png)

in above image output for this hook but you can notice  in 3 output came different from console that is came from value passed to function in handler when press button test boolean, next we will learn how to write hook to intercept parameter value that passed to function and edit function in runtime without reverse application.


## Float data type

```java
public static float divideFloat(float paramFloat1, float paramFloat2) {  
 return paramFloat1 / paramFloat2;  
 }
```




```js


Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

console.log("Divide Float : [ "+type.divideFloat(4,3)+" ]"); 

console.log("divideDouble : [ "+type.divideDouble(4,3)+" ]"); 



});


```


#### Output:
```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
Divide Float : [ 1.3333333730697632 ]
divideDouble : [ 1.3333333333333333 ]
[Google::PID::1688]->






```

### Note
```txt

Float data type it's different  between javascript & Java:
Java has limitation on the precision. 
Javascript (js) in default has an extended precision



```




## Char data type

Frida has ability to convert automatically from java to js char without any wired behavior, below we have two function getNextChar which return next  passed   char and isCChar return boolean if passed char is equal c.

```java

public static char getNextChar(char paramChar) {  
 return (char)(paramChar + 1);  
 }
 
 public static boolean isCChar(char paramChar) {  
 return (paramChar == 'c');  
 }

```


```js
Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

console.log("getNextChar [ "+type.getNextChar('a')+" ]");
console.log("isCChar [ "+type.isCChar('c')+"] ");

console.log("isCChar [ "+type.isCChar('d')+"] ");



});

```


### output

```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
getNextChar [ b ] ---> a its passed char  to getNextChar
isCChar [ true] --->  c its passed to isCChar return [true]
isCChar [ false] --->  d its passed to isCChar return [false]


```



## String data type

in string case it's different from previous data type string it's Java Object must be use wrapper for string and create object from it as below.

```js

var str = Java.use("java.lang.String");

var str1 = str.$new("Frida ");
var str2 = str.$new("String");
```


create str wrapper   and make object from this str by using $new as constructor and passed value in this situation  it's strings value.

after we understand how string passed in frida now we going to call method to concat string.

```java

 public static String concatString(String paramString1, String paramString2) {  
 StringBuilder stringBuilder = new StringBuilder();  
 stringBuilder.append(paramString1);  
 stringBuilder.append(paramString2);  
 return stringBuilder.toString();  
 }
 
```


```js
Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

var str=Java.use("java.lang.String");

var s1=str.$new("Frida");
var s2=str.$new("String");

console.log("concatString ["+type.concatString(s1,s2)+" ]");


});
```

### output

```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
concatString [FridaString ]

```



## Intercept Method
Frida has ability to intercept method to print passed values or edit function content.



```js
Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

type.addTwoBytes.implementation = function (var1,var2) {
  console.log("\ninside addTwoBytes");
  console.log("values ( "+var1+","+var2 +")");
  return 13+4;
}
type.addTwoShorts.implementation = function (var1,var2) {
  console.log("inside addTwoShorts");
  console.log("values ( "+var1+","+var2 +")");
  return 1333+4;
}
type.addTwoLongs.implementation = function (var1,var2) {
  console.log("inside addTwoLongs");
  console.log("values ( "+var1+","+var2 +")");
  return 1333+4;
}



});
```

var1 and var2 are real values that passed to function without any frida interaction by edit function and we edit function return value.

### output

```bash
       ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/

[Google::PID::1688]->
inside addTwoBytes
values ( 10,10)
inside addTwoShorts
values ( 10,10)
inside addTwoLongs
values ( 10,10)


```
value 10,10 are value passed by application when press TEST SUM button as in below code snip.


```java

protected void onCreate(Bundle paramBundle) {  
 super.onCreate(paramBundle);  
 setContentView(2131296284);  
 final TextView results = (TextView)findViewById(2131165335);  
 ((Button)findViewById(2131165225)).setOnClickListener(new View.OnClickListener() {  
 public void onClick(View param1View) {  
 BasicTypes.addTwoInts(10, 10);  
 BasicTypes.addTwoBytes((byte)10, (byte)10);  
 BasicTypes.addTwoShorts((short)10, (short)10);  
 BasicTypes.addTwoLongs(10L, 10L);  
 }  
 });
```



## accessing Class attributes

access class attributes its simply just create wrapper for class and use it in order to access attributes which different depend on access modifier (public , private and protected ) 


```java
package com.blog.testfrida.complexobjects;  
  
public class ScopeObject {  
 static String nonModifiedStaticObject;  
   
 private static String privateStaticObject = "private static object";  
   
 protected static String protectedStaticObject = "protected static object";  
   
 public static String publicStaticObject = "public static object";
```


```js
Java.perform(function(){



var type=Java.use("com.blog.testfrida.complexobjects.ScopeObject");

console.log("publicStaticObject [ "+type.publicStaticObject.value+" ]");

console.log("privateStaticObject [ "+type.privateStaticObject.value+" ]");
console.log("protectedStaticObject [ "+type.protectedStaticObject.value+" ]");


});

```


#### Note

added value to attributes will print value because of attributes in frida objection holds an encapsulation of a class , when you access it directly will return [ object Object ] and in this case it will be cast to default string object. 


### output

```bash
    ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
publicStaticObject [ public static object ]
privateStaticObject [ private static object ]
protectedStaticObject [ protected static object ]

```


## Methods 
a method its function that defined in class , call method from java through frida will be depend on how method access modifier defined.
static method will be called by using class wrapper directly, but in non-static method will be called through instance of object.


### Static Method

```java
  
public class BasicTypes {  
 public static byte addTwoBytes(byte paramByte1, byte paramByte2) {  
 return (byte)(paramByte1 + paramByte2);  
 }  
   
 public static int addTwoInts(int paramInt1, int paramInt2) {  
 return paramInt1 + paramInt2;  
 }  
   
 public static long addTwoLongs(long paramLong1, long paramLong2) {  
 return paramLong1 + paramLong2;  
 }  
   
 public static short addTwoShorts(short paramShort1, short paramShort2) {  
 return (short)(paramShort1 + paramShort2);

```

static methods will be access by using class wrapper, in this example wrapper will be type and call method directly as in below example.



```js

Java.perform(function(){



var type=Java.use("com.blog.testfrida.examples.BasicTypes");

console.log("addint : [ "+type.addTwoInts(1,2)+" ]"); 
console.log("addbytes : [ "+type.addTwoBytes(12,2)+" ]"); 
console.log("addTwoLongs : [ "+type.addTwoLongs(199393,2)+" ]"); 


});

```

### output

```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
addint : [ 3 ]
addbytes : [ 14 ]
addTwoLongs : [ 199395 ]
[Google::PID::1688]->

```


### Non-static method

non-static method call will be through instance object

```java
package com.blog.testfrida.complexobjects;  
  
public class Person {  
 private int age;  
 private int id;  
 private String name;    
 public Person() {}     
 public Person(int paramInt1, String paramString, int paramInt2) {  
 this.id = paramInt1;  
 this.name = paramString;  
 this.age = paramInt2;  
 }     
 public int getAge() {  
 return this.age;  
 }     
 public int getId() {  
 return this.id;  
 }     
 public String getName() {  
 return this.name;  
 }     
 public void setAge(int paramInt) {  
 this.age = paramInt;  
 }     
 public void setId(int paramInt) {  
 this.id = paramInt;  
 }     
 public void setName(String paramString) {  
 this.name = paramString;  
 }
```

in order to call non-static method must create instance object as in below example create instance from wrapper and using it to call method



```js
Java.perform(function(){



var type=Java.use("com.blog.testfrida.complexobjects.Person");
var str=Java.use("java.lang.String");


var obj=type.$new();
obj.setId(1337);
obj.setAge(29);
obj.setName(str.$new("Frida"));

console.log("getId [ "+obj.getId()+" ] ");
console.log("getName [ "+obj.getName()+" ] ");
console.log("getAge [ "+obj.getAge()+" ] ");



});
```

1- create wrapper type for Person class <br>
2- create instance from this wrapper by use [  var obj=type.$new();  ] <br>
3- call method by using this instance [  obj.setId(1337);  ] <br>
4- create wrapper for String as we explain how to pass string in frida , in order to pass string to getName. <br>
5- call [ getId , getName ,  getAge  ] <br>



### output

```bash
     ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
Attaching...
getId [ 1337 ]
getName [ Frida ]
getAge [ 29 ]
[Google::PID::1796]->



```



## overridden methods

in java there is possibility to find two or more method have same of different parameter or different data type.

```java
  
  
  public static int multiply(int paramInt1, int paramInt2) {  
 return paramInt1 * paramInt2;  
 }
  
 public static byte multiply(byte paramByte1, byte paramByte2) {  
 return (byte)(paramByte1 * paramByte2);  
 }  
   
 public static float multiply(float paramFloat1, float paramFloat2) {  
 return paramFloat1 * paramFloat2;  
 }  
   
 public static float multiply(Person paramPerson, float paramFloat) {  
 return 12.0F;  
 }  
   
 public static float multiply(List<String> paramList, float paramFloat) {  
 return 12.0F;  
 }
```


multiply has different implementations with different data types.

```js
Java.perform(function(){



var type= Java.use("com.blog.testfrida.examples.BasicTypes"); 

type.multiply.overload('int','int').implementation = function (x, y) {
     console.log("values ( "+x+","+y+" )");
    return x * y;
}

});

```


data types are different from frida to java which will be list in below table



|Java Type|Frida Type|
|-|-|
|int|int|
|byte|byte|
|short|short|
|long|long|
|float|float|
|double|double|
|char|char|
|{Object} (eg. String)|{package}.{Object} (eg. java.lang.String)|
|int[]|[I|
|byte[]	|[B|
|short[]|[S|
|long[]	|[J|
|float[]|[F|
|double[]|[D|
|char[]|[C|
|{Object}[]|[L{package}.{Object} (eg. [Ljava.lang.String;)|



we going write hook using above table , in this method we have Person class pass as array  and object.

```java
 public static float multiply(Person[] paramArrayOfPerson, Person paramPerson) {  
 return 12.0F;  
 }
```


```js
Java.perform(function(){

var type= Java.use("com.blog.testfrida.examples.BasicTypes"); 

type.multiply.overload('[Lcom.blog.testfrida.complexobjects.Person;','com.blog.testfrida.complexobjects.Person').implementation = function (x, y) {
     console.log("values ( "+x+","+y+" )");
    return  x*y;
}
});

```
[Lcom.blog.testfrida.complexobjects.Person; --> array of person class<br>
com.blog.testfrida.complexobjects.Person --> person class.





## This keyword
this is reference variable that refers to current object, by using this keyword we are calling original method without any edit in method in runtime this could help in follow:

1- print value that passed to method.<br>
2- print stack trace to know where method been called.


```java

  
 public static long addTwoLongs(long paramLong1, long paramLong2) {  
 return paramLong1 + paramLong2;  
 }
```

in above code  addTwoLongs function return long data type so in hook we must return same value by using this keyword.


write hook without return value we notice error 

```js


Java.perform(function () { 


var type=Java.use("com.blog.testfrida.examples.BasicTypes");

type.addTwoLongs.implementation=function(x,y){
console.log("\ninside addTwoLongs ");
console.log("value ( "+x+","+y+" )");


}


});


```

```bash
Error: Implementation for addTwoLongs expected return value compatible with long
    at ne (frida/node_modules/frida-java-bridge/lib/class-factory.js:614)
    at <anonymous> (frida/node_modules/frida-java-bridge/lib/class-factory.js:592)

```

return value must be long so we call addTwoLongs by using this and pass same value passed in implementation.


```js

Java.perform(function () { 


var type=Java.use("com.blog.testfrida.examples.BasicTypes");

type.addTwoLongs.implementation=function(x,y){
console.log("\ninside addTwoLongs ");
console.log("value ( "+x+","+y+" )");
return this.addTwoLongs(x,y);


}


});


```

### output
```bash
    ____
    / _  |   Frida 15.0.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/

[Google::PID::1796]->
inside addTwoLongs
value ( 10,10 )


```


