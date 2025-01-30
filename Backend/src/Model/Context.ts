interface Content {
  id: string;
  content: string;
}

class InMemoryContentDatabase {
  private contentStore: { [key: string]: Content } = {};

  saveContent(id: string, content: string): Content {
    const newContent: Content = { id, content };
    this.contentStore[id] = newContent;
    return newContent;
  }

  getContent(id: string): Content | undefined {
    return this.contentStore[id];
  }

  updateContent(id: string, content: string): Content | undefined {
    const existingContent = this.contentStore[id];
    if (existingContent) {
      existingContent.content = content;
      return existingContent;
    }
    return undefined;
  }

  getAllContent(): Content[] {
    return Object.values(this.contentStore);
  }
}

export default InMemoryContentDatabase;
