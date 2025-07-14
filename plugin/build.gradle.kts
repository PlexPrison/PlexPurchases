plugins {
    java
    `java-library`
    id("com.mineplex.sdk.plugin") version "1.18.4"
}

group = "com.plexprison.plexpurchases"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:2.15.2")
}