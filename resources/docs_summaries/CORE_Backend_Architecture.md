# Halo Plugin Development: Backend Architecture

## 1. Data Model (Extension/CRD)
> All persistent data MUST be defined as Extensions.

### Standard Template
```java
@Data
@GVK(group = "demo.plugin.halo.run", version = "v1alpha1", kind = "Todo", plural = "todos", singular = "todo")
public class Todo extends AbstractExtension {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Spec spec;
}
```

## 2. Content Storage: The Snapshot Mechanism
> ⚠️ **IMPORTANT**: In Halo 2.x, the content of a Post/Page is NOT stored in `PostSpec`.
> It is stored in a separate `Snapshot` resource.

### How to Create a Post with Content
```java
// 1. Create the Post (Metadata only)
Post post = new Post();
post.setMetadata(new Metadata());
post.getMetadata().setName("my-unique-slug");
post.setSpec(new PostSpec());
post.getSpec().setTitle("Article Title");
client.create(post);

// 2. Create the Snapshot (The actual content)
Snapshot snapshot = new Snapshot();
snapshot.setMetadata(new Metadata());
snapshot.getMetadata().setGenerateName("post-snapshot-");
snapshot.setSpec(new SnapshotSpec());
snapshot.getSpec().setRaw("<h1>Hello World</h1>");
snapshot.getSpec().setRawType("html"); // or markdown

// 3. Link Snapshot to Post
Ref postRef = new Ref();
postRef.setGroup("content.halo.run");
postRef.setKind("Post");
postRef.setName(post.getMetadata().getName());
snapshot.getSpec().setSubjectRef(postRef);

client.create(snapshot);
```

## 3. Object Management (SchemeManager)
Plugins MUST register their models during the `start()` lifecycle.

```java
@Override
public void start() {
    schemeManager.register(MyTask.class);
}
```