# Halo Plugin Development: Common Utils & Metadata

## 1. The `Ref` Class (Reference)
Used to link one Extension to another. In 2.22.0, use the Setter pattern.

```java
Ref ref = new Ref();
ref.setGroup("content.halo.run");
ref.setKind("Post");
ref.setName("my-post-name");
```

## 2. Metadata & Naming
Every extension must have a `Metadata` object.

```java
Metadata metadata = new Metadata();
metadata.setName("fixed-name"); // Use for Singletons
// OR
metadata.setGenerateName("prefix-"); // Use for auto-generated names
```

## 3. Owner References (Automatic Cleanup)
To ensure that deleting a parent resource (e.g., a Task) deletes its children (e.g., a Log):

```java
OwnerReference owner = new OwnerReference();
owner.setApiVersion(parent.getApiVersion());
owner.setKind(parent.getKind());
owner.setName(parent.getMetadata().getName());
owner.setUid(parent.getMetadata().getUid());

child.getMetadata().setOwnerReferences(List.of(owner));
```

## 4. Condition Status
Used to report status in `Status` internal classes.
```java
Condition condition = new Condition();
condition.setType("Ready");
condition.setStatus(ConditionStatus.TRUE);
condition.setReason("TaskCompleted");
condition.setMessage("Successfully imported from Wechat.");
status.setConditions(List.of(condition));
```
