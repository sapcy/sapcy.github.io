---
format: md
title: "Core - 1. IoC Container (Introduction ~ Container Overview)"
description: "레퍼런스 문서에서 이 파트는 스프링 프레임워크에 필수인 모든 기술을 다룬다. 그 중에서도 핵심 기술은 IoC (Inversion of Control) 컨테이너이다. 스프링 프레임워크의 IoC 컨테이너는 스프링의 AOP (Aspect-Oriented Programming: 관점 지향 프로그래밍) 기술의 포괄적인 범위가 뒤따른다. 스프링 프레임워크는 개념적으로"
tags:
  - backend
  - spring

---

레퍼런스 문서에서 이 파트는 스프링 프레임워크에 필수인 모든 기술을 다룬다. 그 중에서도 핵심 기술은 IoC (Inversion of Control) 컨테이너이다. 스프링 프레임워크의 IoC 컨테이너는 스프링의 AOP (Aspect-Oriented Programming: 관점 지향 프로그래밍) 기술의 포괄적인 범위가 뒤따른다. 

스프링 프레임워크는 개념적으로 이해하기 쉽고 자바 엔터프라이즈 프로그래밍의 AOP 요구사항 sweet spot의 80%를 성공적으로 해결하는 자체적 AOP 프레임워크를 갖고 있다.  
스프링에는 AspectJ (현재 자바 엔터프라이즈 환경에서 가장 풍부한 기능과 성숙한 AOP 구현)가 통합되어 제공된다.

## **1\. The IoC Container**

이 챕터는 스프링의 IoC 컨테이너를 다룬다.

### **1.1. Introduction to the Spring IoC Container and Beans**

이 챕터는 DI(dependency injection: 의존성 주입)이라고도 알려져 있는 IoC 원칙의 스프링 프레임워크 구현을 다룬다.

IoC는 ①생성자의 매개변수, ②팩토리 메서드의 매개변수, 그리고 ③팩토리 메서드로부터 생성되거나 반환된 후 객체 인스턴스에 세팅된 프로퍼티를 통해서만 객체의 종속성을 정의하는 프로세스이다. IoC 컨테이너는 Bean을 생성할 때 종속성을 주입한다.

이 프로세스는 클래스의 생성자나 서비스 중개자 패턴과 같은 메커니즘을 사용하여 스스로 인스턴스화하거나 종속성의 위치를 제어하는 Bean 자체의 역이다. (그래서 이름이 IoC: 제어의 역전)

스프링 프레임워크의 IoC 컨테이너의 기본 패키지는 org.springframework.beans와 org.springframework.context이다. 

BeanFactory 인터페이스는 모든 타입의 객체를 관리할 수 있는 향상된 구성 메커니즘을 제공한다. ApplicationContext는 BeanFactory 인터페이스의 서브 인터페이스이다.

  
아래는 추가로 제공되는 기능이다.

*   스프링의 AOP 기능과의 더 쉬운 통합
*   메세지 리소스 핸들링 (다국어 처리에 사용)
*   이벤트 발행
*   웹 어플리케이션에서 사용하기 위한 WebApplicationContext와 같은 Application 계층의 특정 컨텍스트

간단히 말하자면, BeanFactory는 구성 프레임워크와 기본 기능을 제공하며, ApplicationContext는 더 많은 엔터프라이즈별 기능을 추가한다. ApplicationContext는 BeanFactory의 완전한 상위 집합이며, 스프링 IoC 컨테이너의 설명 중 이 장에서  오직 이부분에 대해 설명한다. ApplicationContext를 대신해 BeanFactory의 사용하는데 대한 자세한 내용은 [The BeanFactory](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-beanfactory) 를 참조하자.

스프링에서는, 어플리케이션의 백본을 형성하며 스프링 IoC 컨테이너에 의해 관리되는 객체들을 beans라고 한다.  
Bean은 스프링 IoC 컨테이너에 의해 인스턴스화, 조립 및 관리되는 객체를 말한다. 그렇지 않으면, Bean은 그저 당신의 어플리케이션의 수많은 객체들 중 하나일 뿐이다. Bean들과 종속성들은 컨테이너가 사용하는 구성 메타데이터에 반영된다.

### **1.2. Container Overview**

org.springframework.context.ApplicationContext 인터페이스는 스프링 IoC 컨테이너를 나타내며, Bean들을 인스턴스화, 설정, 조립하는 것을 담당한다. 컨테이너는 구성 메타데이터를 읽고 인스턴스화, 설정, 조립할 객체에 대한 정보를 얻는다. 구성 메타데이터는 XML, 자바 어노테이션 혹은 자바 코드로 쓰는데, 이를 통해 당신의 어플리케이션을 구성하는 객체와 객체 간의 많은 상호 종속성을 표현할 수 있다.

ApplicationContext 인터페이스의 몇몇 구현은 스프링과 함께 제공된다. 독립형 어플리케이션에서는 [ClassPathXmlApplicationContext](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/context/support/ClassPathXmlApplicationContext.html) 이나 [FileSystemXmlApplicationContext](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/context/support/FileSystemXmlApplicationContext.html) 의 인스턴스를 생성하는 것이 일반적이다.

XML은 구성 메타데이터를 정의하는 고전적인 형식이었지만, 이제 당신은 자바 어노테이션이나 코드를 통해 컨테이너에 메타데이터를 설정할 수 있다. 이 추가된 형식들(자바 어노테이션과 코드)은 소량의 XML 구성으로 제공된 메타데이터 형식이다.

대부분 어플리케이션의 시나리오에서는 스프링 IoC 컨테이너의 하나 이상의 인스턴스들을 인스턴스화하는데 명시적인 사용자의 코드를 필요로 하지 않는다. 예를 들어, 웹 어플리케이션 시나리오에선 보통 web.xml 파일의 8줄(또는 그정도)의 보일러 플레이트면 충분하다. ([Convenient ApplicationContext Instantiation for Web Applications](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-create)를 참조)

만약 스프링 툴로 이클립스를 사용한다면, 몇 번의 마우스 입력 또는 키 입력으로 쉽게 보일러 플레이트 구성을 만들 수 있다.

아래의 다이어그램은 고수준에서 스프링이 어떻게 동작되는지 보여준다. 어플리케이션 클래스들은 구성 메타데이터와 결합되어, ApplicationConext가 만들어지고 초기화된 후에야 완전히 구성되고 실행 가능한 시스템이나 어플리케이션이 된다.

![](https://blog.kakaocdn.net/dna/emBw5j/btrEO420ABT/AAAAAAAAAAAAAAAAAAAAAKAk2PNLkXTj25Vzbm36YJ3Sb4vGfx6dLj9mwQNjSS7b/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1774969199&allow_ip=&allow_referer=&signature=ZXw76Qv7gcK80NbJ7f70MBW0lj8%3D)

Figure 1. The Spring IoC container

#### **1.2.1. Configuration Metadata**

앞의 다이어그램에서 볼 수 있듯이 Spring IoC 컨테이너는 구성 메타데이터 형식을 사용한다. 어플리케이션 개발자는 구성 메타데이터를 통해 스프링 컨테이너에게 객체를 인스턴스화, 설정, 조립하는 것을 알려준다.

구성 메타데이터는 고전적으로 단순하고 직관적인 XML 형식으로 되어있는데, 이는 대부분 스프링 IoC 컨테이너의 주요 개념과 기능을 전달하는데 사용된다.

<table border="1"><tbody><tr><td><span>XML 기반 메타데이터만이 구성 메타데이터 형식으로 가능한건 아니다.&nbsp;</span><br /><span>스프링 IoC 컨테이너는 구성 메타데이터가 실제로 작성되는 형식에서 그 자체로 완전히 분리되어 있다. 오늘날에는 많은 개발자들이 스프링 어플리케이션의 구성을 자바 기반으로 선택하고 있다. (@Bean, @Configuration 등)</span></td></tr></tbody></table>

스프링 컨테이너의 다른 메타데이터 형식에 대한 정보를 보면,

*   [Annotation-based configuration](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-annotation-config): 스프링 2.5부터 어노테이션 기반의 구성 메타데이터를 지원됨.
*   [Java-based configuration](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java): 스프링 3.0부터 스프링 JavaConfig 프로젝트가 제공하는 많은 기능들이 스프링 프레임워크 코어의 일부가 되었다. 그래서 XML 파일 대신 자바로 어플리케이션 클래스 밖에 bean들을 정의할 수 있다. 이러한 새로운 기능들을 사용하기 위해 [@Configuration](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [@Bean](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html), [@Import](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Import.html), and [@DependsOn](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/DependsOn.html) 어노테이션들을 참고해라.

스프링 구성은 컨테이너가 반드시 관리해야하는 최소 하나 이상의 Bean 정의로 구성된다. XML 기반 구성 메타데이터는 이러한 Bean들을 <bean/> 요소로 하여 최상위 요소 <beans/> 안에 넣는다. 자바 구성은 일반적으로 @Configuration 클래스 내에서 @Bean이 달린 메서드와 함께 사용된다.

이 Bean 정의들은 어플리케이션을 구성하는 실제 객체들에 해당한다. 일반적으로는 서비스 계층 객체, 데이터 접근 객체(DAOs), Struts Action 인스턴스와 같은 프레젠테이션 객체, Hibernate SessionFactories와 같은 인프라 객체를 정의한다. 일반적으로, 도메인 객체를 만들고 로드하는 것은 DAOs와 비지니스 로직의 역할이므로 컨테이너에 세분화된 도메인 객체를 구성하진 않는다. 그러나 Spring과 AspectJ의 통합으로 IoC 컨테이너의 제어 밖에서 생성된 객체를 구성할 수 있다. [Using AspectJ to dependency-inject domain objects with Spring](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop-atconfigurable) 를 참고할 것.

다음 예제는 XML 기반 설정 메타데이터의 기본 구조를 보여준다:

```markup
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="..." class="...">  
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions go here -->

</beans>
```

<table border="1"><tbody><tr><td><span>id 속성은 개별 Bean 정의를 식별하는 문자열이다.<br /></span></td></tr><tr><td><span>class 속성은 Bean의 유형을 정의하고 완전한 클래스 이름을 사용한다.</span></td></tr></tbody></table>

id 속성의 값은 협동 객체를 참조한다. 협동 객체를 참조하기 위한 XML은 예제에서는 보여주지 않는다. [Dependencies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)에서 더 많은 정보를 확인하자.

#### **1.2.2. Instantiating a Container 컨테이너**

ApplicationContext 생성자에 제공된 위치 경로나 경로는 컨테이너가 로컬 파일 시스템, 자바 CLASSPATH 등과 같은 다양한 외부 리소스로부터 구성 메타데이터를 로드할 수 있도록 하는 리소스 문자열이다.

```properties
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

<table border="1"><tbody><tr><td><div><span>스프링 IoC 컨테이너를 학습한 후엔, URI 구문에 정의된 위치로부터 InputStream을 읽기 위한 편리한 메커니즘을 제공하는 스프링의 리소스 추상화에 대해 더 알고 싶을 것이다. 대표적으로, 리소스 경로는&nbsp;<a href="https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-app-ctx">Application Contexts and Resource Paths</a>에 설명된대로 어플리케이션 컨텍스트를 생성하곤 한다.</span></div></td></tr></tbody></table>

다음 예제는 서비스 계층 객체(services.xml) 설정 파일을 보여준다:

```markup
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->

    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>
```

다음 예제는 데이터 접근 객체 daos.xml 파일을 보여준다:

```markup
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao"
        class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>
```

앞선 예제에서는, 서비스 계층은 PetStoreServiceImpl 클래스와 DAO 형태의 JpaAccountDao, JpaItemDao로 구성(JPA 객체-관계 매핑 표준에 기반)된다. 각 요소의 속성명은 Java Bean의 속성명을 참조하고, 참조 요소들은 다른 Bean 정의명을 참조한다. id와 참조 요소간의 이러한 연결은 협동하는 객체 간의 종속성을 나타낸다. 객체들의 종속성 구성의 상세 정보는 [Dependencies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)를 참조하자.

#### XML 기반 구성 메타데이터 작성하기

Bean 정의가 여러 XML 파일에 걸쳐 있는 것이 유용하다. 종종, 개별 XML 구성 파일은 아키텍처의 모듈이나 논리적인 계층을 나타낸다.

어플리케이션 컨텍스트 생성자를 사용하여 모든 XML 조각들로부터 Bean 정의를 로드할 수 있다. 생성자는 이전 섹션에서 본바와 같이, 여러 리소스 위치를 사용한다. 또는 하나 이상의 <import/> 요소를 통해 다른 파일로부터 Bean 정의를 로드한다. 다음 예제가 이 방법을 보여준다:

```markup
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

앞선 예제에서, 외부 Bean 정의들이 services.xml, messageSource.xml, themeSource.xml 3개의 파일로부터 로드되었다. 모든 위치 경로는 가져오기를 하는 파일의 상대적인 경로이므로 services.xml은 반드시 예제의 XML 파일과 같은 클래스경로 위치나 같은 디렉토리에 있어야 한다.

반면 messageSource.xml과 themeSource.xml은 가져오기를 하는 파일 위치 아래의 resources 위치에 있어야 한다. 맨 앞의 슬래시(/)는 무시된다. 그러나, 주어진 이 경로들은 상대적이므로 슬래시를 사용하지 않는 것이 더 좋다. 최상위 <beans/> 요소를 포함하여 가져오는 파일의 내용은 스프링의 스키마에 따라 유효한 XML Bean 정의여야 한다.

<table border="1"><tbody><tr><td><div><span>상대적 경로 "../"를 사용하여 부모 디렉토리의 파일들을 참조하는 것은 가능하지만 추천하지는 않는다. 이렇게 하면 현재 어플리케이션의 외부에 있는 파일에 종속성이 생기게 된다. 특히, 이 참조는 런타임 확인 프로세스가 가장 가까운 클래스 경로 루트를 선택하고 상위 디렉토리를 바라보는 classpath: URLs (예: classpath:../services.xml)는 권장하지 않는다. 클래스 경로 설정 변경으로 인해 다른 잘못된 디렉토리가 선택될 수 있다.<br />상대 경로 대신 항상 완전히 정규화된 리소스 위치를 사용할 수 있다. 예를 들어, file:C:/config/services.xml 나 classpath:/config/services.xml. 하지만, 어플리케이션 설정을&nbsp;특정 절대 경로 위치에 연결하고 있다는 점을 유의하자. 일반적으로 런타임시엔 JVM 시스템 속성에 대해 확인되는 "$\{...\}" 표시자를 통해 절대 경로에 대한 간접 참조를 유지하는 것이 좋다.</span></div></td></tr></tbody></table>

네임스페이스 자체는 import 지시문 기능을 제공한다. 스프링에서 제공하는 XML 네임스페이스(예: 컨텍스트 및 유틸 네임스페이스) 선택에서 일반 Bean 정의 이상의 추가 구성 기능들을 사용할 수 있다.

#### The Groovy Bean Definition DSL

외부화 된 설정 메타데이터의 또 다른 예로서, Bean 정의는 흔히 Grails 프레임워크에서 알려진 바와 같이 스프링의 Groovy Bean Definition DSL로 표현될 수 있다. 일반적으로 이러한 설정은 다음 예제와 같은 구조의 ".groovy" 파일에 있다:

```java
beans {
    dataSource(BasicDataSource) {
        driverClassName = "org.hsqldb.jdbcDriver"
        url = "jdbc:hsqldb:mem:grailsDB"
        username = "sa"
        password = ""
        settings = [mynew:"setting"]
    }
    sessionFactory(SessionFactory) {
        dataSource = dataSource
    }
    myService(MyService) {
        nestedBean = { AnotherBean bean ->
            dataSource = dataSource
        }
    }
}
```

이 설정 스타일은 XML Bean 정의와 거의 동일하며 스프링의 XML 설정 네임스페이스를 지원한다. 또한 XML Bean 정의 파일들을 importBeans 지시문을 통해 가져올 수 있다.

#### **1.2.3. Using the Container**

ApplicationContext는 다른 Bean들과 그들의 의존성의 레지스트리를 관리할 수 있는 고급 팩토리 인터페이스이다.  
`T getBean(String name, Class<T> requiredType)` 메서드를 사용하여 Bean 인스턴스들을 얻을 수 있다.

다음 예제와 같이, ApplicationContext는 Bean정의를 읽고 접근할 수 있다.

```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();
```

Groovy 설정을 사용하면, 부트 스트랩이 매우 비슷해보인다. 이것은 Groovy를 인식하는 다른 컨텍스트 구현 클래스를 가진다(또한, XML Bean 정의도 인식). 다음 예제는 Groovy 설정을 보여준다:

```properties
ApplicationContext context = new GenericGroovyApplicationContext("services.groovy", "daos.groovy");
```

가장 유연한 변형은 다음 예제와 같이 XML 파일용 XmlBeanDefinitionReader와 같이 독자 위임자와 결합된 GenericApplicationContext이다.

```properties
GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();
```

다음 예제와 같이 Groovy 파일용 GroovyBeanDefinitionReader 를 사용할 수 있다.

```properties
GenericApplicationContext context = new GenericApplicationContext();
new GroovyBeanDefinitionReader(context).loadBeanDefinitions("services.groovy", "daos.groovy");
context.refresh();
```

다양한 설정 소스로부터 Bean 정의를 읽으면서, 동일한 ApplicationContext에 이러한 독자 대리자를 섞고 매치시킬 수 있다.

그러면 Bean들로부터 getBean을 사용하여 인스턴스를 얻을 수 있다. ApplicationContext 인터페이스는 Bean을 얻기 위한 다른 몇 가지 메서드가 있지만, 이상적으로는 어플리케이션 코드에서 이러한 메서드를 사용해서는 안된다. 실제로 어플리케이션 코드에는 getBean() 메서드에 대한 호출이 없어야하므로 스프링 API에 대한 종속성이 없어야 한다. 예를 들어, 스프링의 웹 프레임워크 통합은 컨트롤러 및 JSF 관리 Bean과 같은 다양한 웹 프레임워크 컴포넌트에 대한 종속성 주입을 제공하여 메타데이터(autowiring 어노테이션과 같은)를 통해 특정 Bean에 대한 종속성을 선언할 수 있도록 한다.

### **레퍼런스**

 [Core Technologies

In the preceding scenario, using @Autowired works well and provides the desired modularity, but determining exactly where the autowired bean definitions are declared is still somewhat ambiguous. For example, as a developer looking at ServiceConfig, how do

docs.spring.io](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-annotation-config)
